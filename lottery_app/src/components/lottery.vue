<template>
  <div class="lottery-panel">
    <section class="lottery-container">
      <ul
        class="box"
        v-for="box in localBoxes"
        :key="box.id"
        :class="`${box.id}_box`">
        <li
          class="ball"
          v-for="ball in box.balls"
          :key="ball"
          :class="{'active': ballIsActive(box.id, ball)}"
          @click="chooseHandle(box.id, ball)">
          {{ball}}
        </li>
      </ul>
    </section>
    <div v-if="loading" class="loading-mask">computing...</div>
  </div>
</template>
<script lang='ts'>
/*
 Prop:
  datas
    ├─id: string,
    ├─money: number, // 单注价格
    └─boxes: Array // 彩球选区
      ├─ id: string,
      ├─ color: string, // 选区颜色
      ├─ min: number, // 当前选区一注的最少个数
      └─ range: Array // 选区数字范围：[min, max]
 Event:
  change() // 彩球点击时触发
*/
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { computeBet, numberFormate } from '@/helper/utils';

interface ball {
  id: string,
  color: string,
  min: number,
  range: number[]
}

interface LotteryConfig {
  id: string,
  money: number,
  boxes: ball[] | [],
}

@Component
export default class Lottery extends Vue {
  private localBoxes: { id: string, balls: string[] }[] | [] = [];
  private choosed: { [key: string]: string[]  } = {};
  private limitMap: { [key: string]: number } = {};
  private result = {};
  private loading = false;

  @Prop({ type: Object, default: () => ({})})
  private datas: LotteryConfig = {
    id: '',
    money: 0,
    boxes: []
  };

  @Watch('datas', { immediate: true, deep: true })
  private changeHandler() {
    this.initConfig();
  }

  private mounted() {
    this.initConfig();
  }

  /**
   * 初始化配置
  */
  private initConfig() {
    this.resetConfig();
    if (Object.keys(this.datas).length === 0) {
      return;
    }
    const { boxes = [] } = this.datas;
    this.localBoxes = boxes.map((ball) => {
      const { id, range = [], min } = ball;
      this.limitMap[id] = min;
      const [start, end] = range;
      const balls = [];
      for (let i = start; i <= end; i += 1) {
        balls.push(numberFormate(i));
      }
      return {
        id,
        balls,
      };
    });
    // 设置彩球颜色
    this.$nextTick(() => {
      const { boxes = [] } = this.datas;
      boxes.forEach(({ id, color }) => {
        this.setBallColor(`${id}_box`, color);
      });
    });
  }
  /**
   * 配置重置
  */
  private resetConfig() {
    this.localBoxes = [];
    this.limitMap = {};
    this.choosed = {};
  }
  /**
   * 赋值彩球颜色变量
   * @param {string} className - 选区类名
   * @param {string} color - 彩球颜色
  */
  private setBallColor(className: string, color:  string) {
    const [target] = document.getElementsByClassName(className);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    target.style.setProperty('--ballColor', color);
  }
  /**
   * 判断彩球是否被选中
   * @param {string} boxId - 选区id
   * @param {string} ball - 彩球数字
   * @return {boolean}
  */
  private ballIsActive(boxId: string, ball: string): boolean {
    if (!boxId) {
      return false;
    }
    const targetArr = this.choosed[boxId];
    if (!Array.isArray(targetArr)) {
      return false;
    }
    return targetArr.includes(ball);
  }
  /**
   * 彩球点击事件
   * @param {string} boxId - 选区id
   * @param {string} activeBall - 彩球数字
  */
  private chooseHandle(boxId: string, activeBall: string) {
    if (!boxId) {
      return;
    }
    const targetArr = this.choosed[boxId];
    if (!Array.isArray(targetArr)) {
      // 初始化
      this.$set(this.choosed, boxId, [activeBall]);
    } else {
      const ballIndex = targetArr.findIndex((num) => num === activeBall);
      if (ballIndex !== -1) {
        // 取消选中
        targetArr.splice(ballIndex, 1);
      } else {
        // 选择
        targetArr.push(activeBall);
      }
    }
    this.loading = true;
    const limitMap = this.limitMap;
    const choosed = this.choosed;
    const { isHit, num, result } = computeBet(limitMap, choosed);
    if (isHit) {
      this.result = result;
    }
    this.emitChange(isHit ? num : 0);
  }
  /**
   * change事件
   * @param {number} num - 当前注数
  */
  private emitChange(num: number) {
    let params = {};
    if (num > 0) {
      const { id, money } = this.datas;
      params = {
        id,
        money: money * num,
        num,
        result: this.result,
      };
    }
    this.$emit('change', params);
  }
  /**
   * 重置选择（供父级组件调用）
   */
  private reset() {
    this.choosed = {};
    this.result = {};
  }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/colors.scss';
$ballColor: var(--ballColor, $primary);
.lottery-panel {
  width: 96%;
  margin: 0 auto;
  position: relative;
  .lottery-container {
    width: 100%;
    position: absolute;
    top: .8rem;
    left: 0;
    .box {
      width: 100%;
      padding: .3rem 0 0 .4rem;
      background: $white;
      border-radius: .2rem;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: .8rem;
      .ball {
        width: 1rem;
        height: 1rem;
        border: 2px solid $ballColor;
        border-radius: 50%;
        color: $ballColor;
        margin: 0 .3rem .3rem 0;
        text-align: center;
        line-height: .95rem;
        font: {
          size: .5rem;
          weight: 800;
        }
        &.active {
          background: $ballColor;
          color: $white;
        }
      }
    }
  }
  .loading-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, .15);
    color: #fff;
    top: .8rem;
    left: 0;
  }
}
</style>

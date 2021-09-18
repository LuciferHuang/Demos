<template>
  <main class="wrap">
    <!-- tab -->
    <tabs
      :tabs="tabConfig"
      v-model="activeName"
      @change="tabChange">
    </tabs>
    <!-- 选区 -->
    <lottery-panel
      ref="lotteryPanel"
      :datas="current"
      @change="changeHandle"
    />
    <!-- 页脚 -->
    <count-footer
      :total="total"
      :money="money"
      @submit="submitHandle"
      @clear="clearHandle"/>
  </main>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import tabs from '@/components/tabs.vue';
import lotteryPanel from '@/components/lottery.vue';
import countFooter from '@/components/footer.vue';

@Component({
  components: {
    tabs,
    lotteryPanel,
    countFooter
  }
})
export default class Index extends Vue {
  private activeName = 'double_color';
  private current: { [key: string]: unknown } = {};
  // tab配置
  private tabConfig = [
    {
      cmd: 'double_color',
      name: '双色球'
    },
    {
      cmd: 'big_lottery',
      name: '大乐透'
    },
  ];
  // 不同彩票配置
  private lotteryConfig = [
    {
      id: 'double_color',
      money: 2,
      boxes: [
      {
              id: 'normal',
              color: '#ff5722',
              min: 6,
              range: [1, 33],
            },
            {
              id: 'special',
              color: '#3fabff',
              min: 1,
              range: [1, 16],
            },
          ],
        },
        {
          id: 'big_lottery',
          money: 2,
          boxes: [
            {
              id: 'normal',
              color: '#ff5722',
              min: 5,
              range: [1, 35],
            },
            {
              id: 'special',
              color: '#3fabff',
              min: 2,
              range: [1, 12],
            },
          ],
        }
      ];
      // 结算
    private total = 0;
    private money = 0;
    private bill: { [key: string]: unknown } = {};
  private mounted() {
    this.tabChange();
  }
  
  private tabChange() {
    const target = this.lotteryConfig.find(({ id }) => id === this.activeName);
    if (target) {
      this.current = target;
    }
    this.reset();
  }
  /**
   * lotteryPanel下注响应事件
   * @param {object} params - 单注信息
  */
  private changeHandle(params: { [key: string]: number }) {
    if (Object.keys(params).length === 0) {
      this.reset();
      return;
    }
    const { money, num } = params;
    this.total = num;
    this.money = money;
    this.bill = params;
  }
  /**
   * 提交
  */
  private submitHandle() {
      if (Object.keys(this.bill).length === 0) {
        // this.$toast({
        //   content: '请先下注',
        //   type: 'warning',
        //   position: 'center',
        // });
        return;
      }
      // TO DO 提交
      // test
      const { result } = this.bill;
      console.log(result);
      // let str = '';
      // Object.keys(result).forEach(key => {
      //   str += `<i class='red-text'>${key}</i><div>${result[key].join('<br/>')}</div>`;
      // });
      // this.$dialog({
      //   innerHtml: true,
      //   content: str,
      // });
    }
  /**
   * 清空
  */
  private clearHandle() {
    if (Object.keys(this.bill).length === 0) {
      return;
    }
    // this.$dialog({
    //   type: 'warning',
    //   content: '确定要清空吗？',
    //   confirm: () => {
    //     this.reset();
    //     this.executeChild('lotteryPanel', 'reset');
    //   },
    // });
  }
  private reset() {
    this.total = 0;
    this.money = 0;
    this.bill = {};
  }
  /**
   * 执行子组件函数
   * @param {string} ref - 子组件ref
   * @param {string} method - 函数名
   * @return
   */
  private executeChild(ref: string, method: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const child: { [key: string]: any } = this.$refs[ref];
    if (!child) {
      return;
    }

    const func = child[method];
    if (typeof func === 'function') {
      return func();
    }
  }
}
</script>
<style lang="scss">
@import 'src/assets/styles/colors.scss';
.wrap {
  height: 100vh;
  background: $light_gray;
  padding-bottom: 1.5rem;
}
.hv-confirm-dialog-content {
  overflow-y: scroll;
  max-height: 88vh;
}
</style>

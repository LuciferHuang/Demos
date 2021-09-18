<template>
  <ul class="footer">
    <li class="icon" @click="clearHandle">
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        fill="white">
        <path d="M970.41 283.821h-69.462c1.086 7.544 1.629 14.846 1.629 22.148v534.389c0 100.964-83.402 183.099-185.995 183.099h-407.717c-102.533 0-185.995-82.135-185.995-183.099v-534.389c0-7.302 0.543-14.604 1.629-22.148h-69.462c-29.993 0-54.495-24.924-54.495-55.521 0-30.657 24.502-55.581 54.495-55.581h915.372c29.993 0 54.495 24.924 54.495 55.581 0 30.597-24.502 55.521-54.495 55.521zM791.476 305.969c0-7.423-1.267-14.846-3.802-22.148h-549.899c-2.535 7.302-3.802 14.725-3.802 22.148v534.389c0 40.313 33.614 73.203 74.893 73.203h407.717c41.279 0 74.893-32.89 74.893-73.203v-534.389zM614.653 811.693c-26.735 0-46.891-17.199-46.891-40.011v-378.569c0-22.812 20.157-40.072 46.891-40.072 26.674 0 46.891 17.26 46.891 40.072v378.569c0 22.812-20.217 40.011-46.891 40.011zM410.795 811.693c-26.735 0-46.891-17.199-46.891-40.011v-378.569c0-22.812 20.157-40.072 46.891-40.072s46.891 17.26 46.891 40.072v378.569c0 22.812-20.157 40.011-46.891 40.011zM659.493 110.257h-293.537c-30.657 0-55.521-24.864-55.521-55.521s24.864-55.581 55.521-55.581h293.537c30.657 0 55.521 24.924 55.521 55.581s-24.864 55.521-55.521 55.521z"></path>
      </svg>
    </li>
    <li class="msg">
      <div>当前共 {{numberFilter(total)}} 注</div>
      <div>合计 {{numberFilter(money)}} 元</div>
    </li>
    <li class="icon" @click="submitHandle">
      <svg
        viewBox="0 0 1489 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        fill="white">
        <path d="M1329.889189 28.232844l-753.600283 770.385773L159.213571 381.593189a93.060485 93.060485 0 1 0-131.60556 131.605559l483.635043 483.535229a93.1603 93.1603 0 0 0 65.794462 27.266023h0.499073a93.1603 93.1603 0 0 0 66.027362-27.997997L1462.942061 158.35782a93.077121 93.077121 0 1 0-133.086143-130.158247z"></path>
      </svg>
    </li>
  </ul>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { splitThousand } from '@/helper/utils';

@Component
export default class Footer extends Vue {
  @Prop({ type: Number, default: 0 })
  private total = 0;
  @Prop({ type: Number, default: 0 })
  private money = 0;

  private numberFilter = splitThousand;
  private submitHandle() {
    this.$emit('submit');
  }
  private clearHandle() {
    this.$emit('clear');
  }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/colors.scss';
.footer {
  width: 100vw;
  height: 1.5rem;
  display: flex;
  justify-content: space-between;
  background: $red;
  align-items: center;
  text-align: center;
  color: $white;
  font-size: .5rem;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1;
  .icon {
    width: 20%;
    svg {
      width: .8rem;
      height: .8rem;
    }
  }
}
</style>

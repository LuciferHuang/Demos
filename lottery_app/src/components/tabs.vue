<template>
  <ul class="header-tabs">
    <li
      v-for="tab in tabs"
      :key="tab.cmd"
      :class="{'active': tab.cmd === choosed}"
      @click="clickHandle(tab.cmd)">
      {{tab.name}}
    </li>
  </ul>
</template>
<script lang='ts'>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class Tab extends Vue {
  private choosed = '';

  @Prop({ type: Array, default: () => []})
  private tabs = [];
  @Prop({ type: String, default: ''})
  private value = '';

  @Watch('value', { immediate: true })
  private onChangeValue() {
    this.choosed = this.value;
  }

  private clickHandle(cmd: string) {
    this.choosed = cmd;
    this.emitHandle(cmd);
  }
  private emitHandle(cmd: string) {
    this.$emit('input', cmd);
    this.$emit('change', cmd);
  }

  private mounted() {
    this.choosed = this.value;
  }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/colors.scss';
.header-tabs {
  width: 100%;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: .5rem;
  background: $white;
  li {
    width: 50%;
    height: 100%;
    line-height: 1.5rem;
    text-align: center;
    color: $font_useless;
    font-weight: bold;
    position: relative;
    user-select: none;
    &.active {
      color: $font_base;
    }
    &::before {
      content: "";
      position: absolute;
      top: -3px;
      left: 100%;
      width: 0;
      height: 100%;
      border-bottom: 3px solid $primary;
      box-shadow: 0 4px 5px -3px $light_primary;
      transition: 0.2s all linear;
    }
    &.active::before {
      width: 100%;
      left: 0;
    }
  }
  li.active ~ li::before {
    left: 0;
  }
}
</style>

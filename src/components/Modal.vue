<template>
  <div v-if="visible" class="modal-root">
    <div class="modal-top-right">
      <slot name="top-right" />
    </div>
    <div class="modal-middle-right">
      <slot name="middle-right" />
    </div>
    <div class="modal-middle-left">
      <slot name="middle-left" />
    </div>
    <!-- <transition
      name="fade-in"
      enter-active-class="fade-in"
    > -->
    <div
      class="modal-curtain"
      @click="$emit('close')"
      :style="contentStyle"
    />
    <!-- </transition> -->
    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>

<style lang="stylus">
.modal-top-right
  position absolute
  top 0
  right 0

.modal-middle-right
  position absolute
  right 0
  top 50%

.modal-middle-left
  position absolute
  left 0
  top 50%

.modal-root, .modal-curtain
  position fixed
  height 100vh
  width 100vw
  top 0

.modal-root
  display flex
  align-items center
  justify-content center
  z-index 0

@keyframes fade-in
  for i in 0..10
    {10% * i}
      opacity (i/10)

.modal-curtain
  background-color rgba(0,0,0,0.8)
  z-index 1

.modal-content
  background #fff
  overflow hidden
  z-index 2
  animation fade-in 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000) both

</style>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator';

interface Classes {
  content?: string
}

@Component({
  props: {
    open: Boolean,
    height: [Number, String],
    width: [Number, String],
    classes: Object
  }
})
export default class Modal extends Vue {
  classes: Classes = this.classes
  open: boolean = false
  visible: boolean = this.open
  height: number | string = 300
  width: number | string = 600
  contentStyle: object = {
    height: this.height + 'px',
    width: this.width + 'px'
  }

  @Watch('open')
  handleOpenChange(val: boolean) {
    this.visible = val
  }

  @Watch('height')
  handleHeightChange(height: number | string) {
    this.contentStyle = { ...this.contentStyle, height }
  }

  @Watch('width')
  handleWidthChange(width: number | string) {
    this.contentStyle = { ...this.contentStyle, width }
  }
}
</script>

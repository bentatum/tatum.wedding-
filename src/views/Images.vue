<template>
  <div>
    <div class="root">
      <cl-toolbar component="nav" class="page-nav">
        <cl-icon-button @click="handlePageDown">
          <cl-icon>
            keyboard_arrow_left
          </cl-icon>
        </cl-icon-button>
        <cl-typography variant="h4">
          {{ rangeStart }} - {{ rangeEnd }}
        </cl-typography>
        <cl-icon-button @click="handlePageUp">
          <cl-icon>
            keyboard_arrow_right
          </cl-icon>
        </cl-icon-button>
      </cl-toolbar>
      <div class="photo-grid">
        <img
          v-for="index in range"
          :key="index"
          class="photo-grid-item"
          :src="`${imguri}/${thumbSize}x${thumbSize}/Photo-${index}.jpg`"
          @click="handleImgClick(index)"
          v-if="index < imgMaxIndex"
        />
      </div>
    </div>
    <cl-dialog
      :open="showModal"
      @close="handleModalClose"
      :cl-paper-props="{
        class: 'dialog__paper',
        style: {
          width: modalSize + 'px',
          height: modalSize + 'px',
          backgroundImage: `url(${imguri}/${modalSize}x${modalSize}/Photo-${imgIndex}.jpg)`
        }
      }"
    >
      <div class="dialog__controls">
        <cl-icon-button
          class="dialog__download-button"
          component="a"
          download
          :href="`${imguri}/Photo-${imgIndex}.jpg`"
          target="__blank"
        >
          <cl-icon>
            cloud_download
          </cl-icon>
        </cl-icon-button>
      </div>
    </cl-dialog>
  </div>
</template>

<style lang="stylus">
.root
  margin auto

.modal-top-right,
.modal-middle-right,
.modal-middle-left
  z-index 3

.modal-close-button,
.modal-nav-right-button,
.modal-nav-left-button
  color #ffffff
  z-index 3
  background-color transparent
  border: none
  font-size: 2em
  border-radius 100%
  height 2em
  width 2em
  &:hover
    background: rgba(255,255,255,0.1)

.modal-nav-right-button
  color #ffffff
  z-index 3
.page-nav
  justify-content space-between
.photo-grid
  display grid
.photo-grid-item
  width 100%
  max-width 100%

.dialog__paper
  background-position center
  background-size cover
  padding var(--cl-space)
  &:hover .dialog__controls
    opacity 1
.dialog__download-button
  color var(--cl-color__common--white)
.dialog__controls
  transition opacity var(--cl-transition), background-color
  opacity 0
  position absolute
  top var(--cl-space)
  right var(--cl-space)
</style>

<style>
.dialog__download-button:hover {
  background-color: rgba(255,255,255,var(--cl-color__action--hover-opacity));
}

@media (min-width: env(--cl-breakpoints--xs)) {
  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: env(--cl-breakpoints--sm)) {
  .photo-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (min-width: env(--cl-breakpoints--lg)) {
  .photo-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>

<script lang="ts">
import '@/assets/css/theme.css'
import '@clinc/clui/dist/clui.css'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { range, debounce } from 'lodash'
import { Modal } from '@/components'
import { Route } from 'vue-router'
import CLUI from '@clinc/clui'

const IMG_AMT = 35
const DEFAULT_IMG_START = 1000

@Component({ components: { Modal, ...CLUI } })
export default class Images extends Vue {
  imguri: string = process.env.VUE_APP_IMAGE_URI || ''
  range: number[] = range(DEFAULT_IMG_START, DEFAULT_IMG_START + IMG_AMT)
  page: number = 1
  showModal: boolean = false
  imgIndex: number = -1
  modalSize: number = 500
  thumbSize: number = 250
  imgMaxIndex: number = 3162

  handleNextImgReq () {
    this.$router.push({
      path: 'images',
      query: {
        page: String(this.page),
        image: String(this.imgIndex + 1)
      }
    })
  }

  handlePrevImgReq () {
    this.$router.push({
      path: 'images',
      query: {
        page: String(this.page),
        image: String(this.imgIndex - 1)
      }
    })
  }

  handleImgClick (index: number) {
    this.$router.push({
      path: 'images',
      query: {
        page: String(this.page),
        image: String(index)
      }
    })
  }

  handleModalClose () {
    this.$router.push({
      path: 'images',
      query: {
        page: String(this.page)
      }
    })
  }

  @Watch('$route')
  processQuery ({ query: { page, image } }: Route) {
    this.page = +page || 1
    if (image) {
      this.imgIndex = +image
      this.showModal = true
    } else {
      this.imgIndex = -1
      this.showModal = false
    }
  }

  created () {
    this.processQuery(this.$route)
    this.handleResize = debounce(this.handleResize, 500)
    this.modalSize = this.getModalSize()
  }

  mounted () {
    window.addEventListener('resize', this.handleResize)
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  }

  getModalSize () {
    const sm = 320
    const md = 768
    const lg = 1024
    const xl = 1440
    const w = document.documentElement.clientWidth
    if (w <= md) {
      return sm
    } else if (w > md && w <= lg) {
      return md
    }
    return lg
  }

  handleResize () {
    this.modalSize = this.getModalSize()
  }

  displayRangeValue(value: number): number {
    return (value - 1000) + 1
  }

  handlePageDown() {
    const p = this.page
    const nextPage = p > 1 ? p - 1 : 1
    if (nextPage === this.page) {
      return
    }
    this.page = nextPage
    this.$router.push({
      path: 'images',
      query: {
        page: String(this.page)
      }
    })
  }

  handlePageUp() {
    this.page = this.page + 1
    this.$router.push({
      path: 'images',
      query: {
        page: String(this.page)
      }
    })
  }

  get rangeStart(): number {
    return (this.range[0] - 1000) + 1
  }

  get rangeEnd(): number {
    return (this.range[this.range.length - 1] - 1000) + 1
  }

  @Watch('page')
  updateUrlQuery(page: number) {
    const start = ((page - 1) * IMG_AMT) + 1000
    this.range = range(start, start + IMG_AMT)
  }
}
</script>

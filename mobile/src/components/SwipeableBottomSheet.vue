<template>
  <div :class="['swipeable-bottom-sheet']">
    <div class="wrapper" :data-open="calcedState">
      <div class="bg" @click.prevent="() => setState('close')"></div>
      <div
        ref="card"
        class="card"
        :data-state="isMove ? 'move' : state"
        :style="{ top: `${isMove ? y : calcY()}px` }"
      >
        <div ref="pan">
          <div class="pan-area">
            <div class="bar" ref="bar"></div>
          </div>
          <div class="header" :class="contentIsScrolling ? 'shadow' : ''">
            <slot name="header"></slot>
          </div>
        </div>
        <div class="contents" @scroll="shadowTheHeader">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Hammer from 'hammerjs'

export default {
  name: 'SwipeableBottomSheet',
  props: { value: String, type: String },
  data () {
    return {
      contentIsScrolling: false,
      mc: null,
      y: 0,
      startY: 0,
      isMove: false,
      state: 'close',
      rect: {},
      oldHash: ''
    }
  },
  computed: {
    calcedState () {
      switch (this.state) {
        case 'close':
          return 0
        // case 'half':
        //   return 1
        case 'open':
          return 2
        default:
          return 0
      }
    }
  },
  mounted () {
    this.state = this.value || 'close'

    window.onresize = () => {
      this.rect = this.$refs.card.getBoundingClientRect()
    }
    this.rect = this.$refs.card.getBoundingClientRect()
    this.mc = new Hammer(this.$refs.pan)
    this.y = this.rect.height * 0.8
    this.mc.get('pan').set({ direction: Hammer.DIRECTION_ALL })
    this.mc.on('panup pandown', (evt) => {
      this.y = evt.center.y - 16
    })
    this.mc.on('panstart', (evt) => {
      this.startY = evt.center.y
      this.isMove = true
    })
    this.mc.on('panend', (evt) => {
      this.isMove = false
      switch (this.state) {
        case 'half':
          if (this.startY - evt.center.y > 120) {
            this.state = 'open'
          }
          if (this.startY - evt.center.y < -50) {
            this.state = 'close'
          }
          break
        case 'open':
          if (this.startY - evt.center.y < -120) {
            this.state = 'close'
          }
          break
      }
    })
  },
  beforeDestroy () {
    this.mc.destroy()
    window.onresize = null
  },
  watch: {
    state () {
      this.$emit('input', this.state)
    },
    value (val) {
      this.state = val
    }
  },
  methods: {
    calcY () {
      switch (this.state) {
        case 'close':
          return this.rect.height
        case 'open':
          if (this.type === 'half') {
            return this.rect.height * 0.5
          } else if (this.type === 'third') {
            return this.rect.height * 0.6
          } else {
            return this.rect.height * 0.09
          }
        // case 'half':
        //   return this.rect.height * 0.6
        default:
          return this.y
      }
    },
    open () {
      this.setState('open')
      this.$emit('open')
    },
    close () {
      this.setState('close')
      this.$emit('close')
    },
    half () {
      this.setState('half')
      this.$emit('half')
    },
    setState (state) {
      this.state = state
    },
    shadowTheHeader (e) {
      this.contentIsScrolling = e.target.scrollTop >= 1
    }
  }
}
</script>

<style lang="scss" scoped>
  .shadow {
    box-shadow: 0 3px 3px 1px rgba(0, 0, 0, 0.1);
  }

  .swipeable-bottom-sheet {
    position: relative;
    .wrapper {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2001;
    }

    .wrapper[data-open="1"] .bg, .wrapper[data-open="2"] .bg {
      display: block;
      transition: all .3s;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .3);
    }

    .card {
      width: 100%;
      height: 100vh;
      position: fixed;
      background: white;
      border-radius: 10px 10px 0 0;
      box-shadow: 0 -3px 4px rgba(0, 0, 0, .1);
      left: 0;
    }

    .card[data-state='half'], .card[data-state="open"], .card[data-state="close"] {
      transition: top .3s ease-out;
    }

    .card[data-state="close"] {
      box-shadow: none;
    }

    .bar {
      width: 60px;
      height: 4px;
      border-radius: 14px;
      background: rgba(0, 0, 0, .14);
      margin: 0 auto;
      cursor: pointer;
    }

    .pan-area {
      padding: 8px 0;
    }

    .contents {
      overflow-y: scroll;
      height: 100%;
      padding-bottom: calc(100vh * 0.20);
      box-sizing: border-box;
    }
  }
  /*------------------------------------*/
  .swipeable-bottom-sheet.dark-mode {
    .card {
      background: #e1e1e1;
      box-shadow: 0 -3px 4px rgba(#e1e1e1, .1);
    }

    .bar {
      background: rgba(#e1e1e1, .14);
    }
  }
</style>

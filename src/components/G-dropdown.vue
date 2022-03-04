<template>
  <div :ref="$id('dropdown')" class="dropdown-wrap" :class="{ 'dropdown-active': isShow }">
    <div :class="{ 'dropdown-toggle': isContent() }" @click="isShow = !isShow">
      <slot></slot>
    </div>
    <template v-if="isContent() && isShow">
      <teleport to="#endofbody">
        <div
          :ref="$id('dropdown-box')"
          class="dropdown-box"
          :class="[`to-${newPosition}`, getClassesBox]"
          :style="getStylePosition"
          @click.stop
        >
          <slot name="content" :close-dropdown="closeDropdown"></slot>
        </div>
      </teleport>
    </template>
  </div>
</template>

<script>
export default {
  name: 'GDropdown',

  props: {
    position: {
      type: String,
      default: 'top',
    },

    alignContent: {
      type: String,
      default: '',
    },

    animation: {
      type: Boolean,
      default: false,
    },

    contentMaxWidth: {
      type: [Number, String],
      default: 'inherit',
    },

    space: {
      type: Number,
      default: 8,
    },
  },

  emits: ['on-close'],

  data: () => ({
    newPosition: '',
    isShow: false,

    top: 0,
    left: 0,
    elemWidth: 0,
    elemHeight: 0,
  }),

  computed: {
    getStylePosition() {
      if (!this.isShow) return null;

      return `top: ${Math.floor(this.top)}px; left: ${Math.floor(this.left)}px; max-width: ${Math.floor(
        this.contentMaxWidth
      )}px;`;
    },
  },

  watch: {
    isShow: {
      immediate: true,

      handler(val) {
        if (!window.__eventsDropdown) return;

        if (val) {
          this.setEventsDropdown();
        } else {
          this.removeEventsDropdown();
        }
      },
    },
  },

  created() {
    this.initDropdown();
  },

  methods: {
    initDropdown() {
      if (!window.__eventsDropdown) {
        window.__eventsDropdown = {};
      }
    },

    setEventsDropdown() {
      this.closeDropdown();
      window.__eventsDropdown[this.$id('dropdown-box')] = this;
      this.showContent();
    },

    removeEventsDropdown() {
      delete window.__eventsDropdown[this.$id('dropdown-box')];
    },

    onClose() {
      this.isShow = false;
      window.removeEventListener('scroll', this.onClose);
      window.removeEventListener('resize', this.onClose);
      this.$emit('on-close');
    },

    closeDropdown() {
      if (!window.__eventsDropdown) {
        return;
      }

      for (const id in window.__eventsDropdown) {
        window.__eventsDropdown[id].onClose();
      }
    },

    isContent() {
      return this.$slots['content'] || this.$slots.content;
    },

    async showContent() {
      if (!this.isContent()) return;

      const $element = this.$refs[this.$id('dropdown')].querySelector('.dropdown-toggle');

      const targetEl = $element?.getBoundingClientRect();
      this.elemWidth = targetEl.width;
      this.elemHeight = targetEl.height;
      this.top = targetEl.top;
      this.left = targetEl.left + window.scrollX;

      this.newPosition = this.position;

      if (this.isShow) {
        this.$nextTick(() => {
          const $box = this.$refs[this.$id('dropdown-box')];
          const boxEl = $box?.getBoundingClientRect();
          this.newPosition = this.autoPosition(this.position, targetEl, boxEl);
        });
      }

      await this.setPosition();

      window.addEventListener('scroll', this.onClose);
      window.addEventListener('resize', this.onClose);
    },

    setPosition() {
      if (this.newPosition.includes('top')) {
        this.left += this.elemWidth / 2;
        this.top -= this.space;
      }

      if (this.newPosition.includes('right')) {
        this.left += this.elemWidth + this.space;
        this.top += this.elemHeight / 2;
      }

      if (this.newPosition.includes('bottom')) {
        this.left += this.elemWidth / 2;
        this.top += this.elemHeight + this.space;
      }

      if (this.newPosition.includes('left')) {
        this.left -= this.space;
        this.top += this.elemHeight / 2;
      }
    },

    autoPosition(position, targetEl, boxEl) {
      const { width, height } = boxEl;
      const clientWidth = document.documentElement.clientWidth;
      const clientHeight = document.documentElement.clientHeight;
      const heightHeader = 120;
      const heightFooter = 0;

      const revertInitialPos = (initial, invert) => {
        const reg = new RegExp(initial, 'g');
        return position.replace(reg, invert);
      };

      if (position.includes('top') && targetEl.top < height + heightHeader) return revertInitialPos('top', 'bottom');
      if (position.includes('bottom') && clientHeight - targetEl.bottom < height + heightFooter)
        return revertInitialPos('bottom', 'top');
      if (position.includes('right') && clientWidth - targetEl.right < width) return revertInitialPos('right', 'left');
      if (position.includes('left') && targetEl.left < width) return revertInitialPos('left', 'right');

      return position;
    },

    getClassesBox() {
      if (!this.isShow) return null;

      return {
        [`text-${this.alignContent}`]: this.alignContent,
        animated: this.animation,
      };
    },
  },
};
</script>

<style lang="scss">
.dropdown {
  &-wrap {
    position: relative;
  }

  &-active {
    .dropdown-icon:after {
      border-width: 2px 2px 0 0;
      transform: rotate(-45deg) translate(-1px, 3px);
    }
  }

  &-toggle {
    display: block;
    cursor: pointer;
  }

  &-icon:after {
    content: '';
    margin-right: 3px;
    height: 10px;
    width: 10px;
    border-width: 0 0 2px 2px;
    border-style: solid;
    transform: rotate(-45deg) translateX(3px);
  }

  &-box {
    position: fixed;
    z-index: 1001;
  }

  &-box {
    .list-dropbox {
      padding: 8px 12px;
      min-width: max-content;
      font-size: 18px;
      background: var(--color-main-10);
      -webkit-backdrop-filter: blur(17px);
      backdrop-filter: blur(17px);

      li {
        padding: 8px 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;

        & > * {
          opacity: 0.7;
          transition: all 0.2s linear;
        }

        & + li {
          border-top: 1px solid var(--color-main-90);
        }

        &.disabled,
        &[disabled] {
          pointer-events: none;
        }

        &:hover > * {
          opacity: 1;
        }
      }
    }

    &.to-right {
      transform: translateY(-50%);

      &-start {
        transform: translateY(-12px);
      }

      &-end {
        transform: translateY(calc(-100% + 12px));
      }
    }

    &.to-top {
      transform: translate(-50%, calc(-100% + 4px));
      x &-start {
        transform: translate(-12px, calc(-100% + 4px));
      }

      &-end {
        transform: translate(calc(-100% + 12px), calc(-100% + 4px));
      }
    }

    &.to-bottom {
      transform: translateX(-50%);

      &-start {
        transform: translate(-12px, -2px);
      }

      &-end {
        transform: translate(calc(-100% + 18px), -2px);
      }
    }

    &.to-left {
      transform: translate(-100%, -50%);

      &-start {
        transform: translate(-100%, -12px);
      }

      &-end {
        transform: translate(-100%, calc(-100% + 12px));
      }
    }

    &.animated {
      transition: opacity 0.5s;
    }
  }
}
</style>

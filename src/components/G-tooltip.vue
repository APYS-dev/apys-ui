<template>
  <div :ref="$id('dropdown')" class="tool-tip-icon-wrap">
    <template v-if="customIcon">
      <div class="icon-question"></div>
    </template>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'GTooltip',

  props: {
    position: {
      type: String,
      default: 'bottom',
    },

    arrow: {
      type: String,
      default: '',
    },

    content: {
      type: String,
      required: true,
    },

    contentAlign: {
      type: String,
      default: 'left',
    },

    classTooltip: {
      type: String,
      default: '',
    },

    customIcon: {
      type: Boolean,
      default: true,
    },

    animation: {
      type: Boolean,
      default: false,
    },

    tooltipMaxWidth: {
      type: Number,
      default: null,
    },

    canOverTooltip: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    jsToolTipWrap: null,
    space: 7,
    arrowSize: {
      normal: 8,
      small: 6,
    },

    iconWidth: 0,
    iconHeight: 0,
    top: 0,
    left: 0,
    newPosition: '',
  }),

  computed: {
    getArrowSize() {
      if (this.arrow === '') {
        return this.arrowSize['normal'];
      }
      return this.arrowSize[this.arrow] || this.arrowSize['normal'];
    },
  },

  mounted() {
    this.createItem();

    this.$nextTick(() => {
      this.$refs[this.$id('dropdown')].addEventListener('mouseover', this.showTooltip);
      this.$refs[this.$id('dropdown')].addEventListener('mouseleave', this.onMouseLeave);
    });
  },

  beforeUnmount() {
    this.hideTooltip();
    this.$refs[this.$id('dropdown')].removeEventListener('mouseover', this.showTooltip);
    this.$refs[this.$id('dropdown')].removeEventListener('mouseleave', this.onMouseLeave);
  },

  methods: {
    async showTooltip(e) {
      if (!this.content) {
        return;
      }
      const targetEl = e.currentTarget.getBoundingClientRect();
      this.iconWidth = targetEl.width;
      this.iconHeight = targetEl.height;
      this.top = targetEl.top + window.scrollY;
      this.left = targetEl.left + window.scrollX;

      this.newPosition = this.position;
      if (this.jsToolTipWrap !== null) {
        this.newPosition = this.autoPosition(this.position, targetEl);
      }

      await this.setPosition();
      this.setToolTip();

      window.addEventListener('resize', this.hideTooltip);
    },

    onMouseLeave(e) {
      if (this.canOverTooltip) {
        this.overTooltipHide(e.relatedTarget);
        return;
      }
      this.hideTooltip();
    },

    autoPosition(position, targetEl) {
      this.jsToolTipWrap.innerHTML = this.content;
      const { width, height } = this.jsToolTipWrap.getBoundingClientRect();
      const clientWidth = document.documentElement.clientWidth;
      const clientHeight = document.documentElement.clientHeight;
      const heightHeader = 100;
      const heightFooter = 34;

      const revertInitialPos = (initial, invert) => {
        const reg = new RegExp(initial, 'g');
        return position.replace(reg, invert);
      };

      if (position.includes('top') && targetEl.top < height + heightHeader) {
        return revertInitialPos('top', 'bottom');
      }
      if (position.includes('bottom') && clientHeight - targetEl.bottom < height + heightFooter) {
        return revertInitialPos('bottom', 'top');
      }
      if (position.includes('right') && clientWidth - targetEl.right < width) {
        return revertInitialPos('right', 'left');
      }
      if (position.includes('left') && targetEl.left < width) {
        return revertInitialPos('left', 'right');
      }

      return position;
    },

    setPosition() {
      if (this.newPosition.includes('top')) {
        this.left += this.iconWidth / 2;
        this.top -= this.getArrowSize + this.space + 3;
      }

      if (this.newPosition.includes('right')) {
        this.left += this.iconWidth + this.getArrowSize + this.space;
        this.top += this.iconHeight / 2;
      }

      if (this.newPosition.includes('bottom')) {
        this.left += this.iconWidth / 2;
        this.top += this.iconHeight + this.getArrowSize + this.space;
      }

      if (this.newPosition.includes('left')) {
        this.left -= this.getArrowSize + this.space;
        this.top += this.iconHeight / 2;
      }
    },

    overTooltipHide(relatedTarget) {
      if (relatedTarget?.id === 'jsToolTipWrap') {
        this.jsToolTipWrap.addEventListener('mouseleave', this.hideTooltip);
      } else {
        this.hideTooltip();
      }
    },

    hideTooltip() {
      if (this.jsToolTipWrap !== null) {
        this.jsToolTipWrap.style.opacity = 0;
        this.jsToolTipWrap.classList.remove(`at-${this.newPosition}`);
        this.jsToolTipWrap.classList.remove(`text-${this.contentAlign}`);
        if (this.arrow) {
          this.jsToolTipWrap.classList.remove(this.arrow);
        }
        if (this.animation) {
          this.jsToolTipWrap.classList.remove('animated');
        }
        if (this.classTooltip) {
          this.jsToolTipWrap.classList.remove(this.classTooltip);
        }
        this.jsToolTipWrap.style.top = '-1000px';
        this.jsToolTipWrap.style.left = '-1000px';
        this.jsToolTipWrap.innerHTML = ``;

        window.removeEventListener('resize', this.hideTooltip);
      }
    },

    setToolTip() {
      if (this.jsToolTipWrap !== null) {
        this.jsToolTipWrap.style.opacity = 1;
        this.jsToolTipWrap.classList.add(`at-${this.newPosition}`);
        this.jsToolTipWrap.classList.add(`text-${this.contentAlign}`);
        if (this.arrow) {
          this.jsToolTipWrap.classList.add(this.arrow);
        }
        if (this.classTooltip) {
          this.jsToolTipWrap.classList.add(this.classTooltip);
        }
        if (this.animation) {
          this.jsToolTipWrap.classList.add('animated');
        }
        if (this.tooltipMaxWidth) {
          this.jsToolTipWrap.style.maxWidth = `${this.tooltipMaxWidth}px`;
        } else {
          this.jsToolTipWrap.style.maxWidth = null;
        }
        this.jsToolTipWrap.style.top = `${Math.floor(this.top)}px`;
        this.jsToolTipWrap.style.left = `${Math.floor(this.left)}px`;
      }
    },

    createItem() {
      this.jsToolTipWrap = document.getElementById('jsToolTipWrap');

      if (this.jsToolTipWrap === null) {
        const newNode = document.createElement('div');
        newNode.setAttribute('id', 'jsToolTipWrap');
        newNode.className = `tool-tip-vue`;
        newNode.style.display = 'block';

        if (this.tooltipMaxWidth) {
          newNode.style.maxWidth = `${this.tooltipMaxWidth}px`;
        }

        newNode.style.opacity = 0;
        document.body.append(newNode);

        this.jsToolTipWrap = document.getElementById('jsToolTipWrap');
      }
    },
  },
};
</script>

<style lang="scss">
$color-main: var(--color-main);
$color-main-90: var(--color-main-90);
$background-main: #fff;
$border: #394736;

.tool-tip-vue {
  position: absolute;
  top: 0;
  left: 0;
  margin-bottom: 32px;
  padding: 18px 24px;
  min-width: 72px;
  font-weight: 400;
  width: max-content;
  max-width: 300px;
  background: radial-gradient(
      147.63% 62.14% at 111.49% 78.66%,
      rgba($color-main, 0.128) 0%,
      rgba($color-main, 0.0096) 100%
    ),
    $background-main;
  background-size: 150% 150%;
  background-position: 5% 5%;
  border: 1px solid;
  border-image-slice: 1;
  border-width: 1px;
  border-image-source: linear-gradient(180deg, rgba($color-main, 0.13) 0%, rgba($color-main, 0.02) 100%);
  color: $color-main-90;
  font-size: 11px;
  font-weight: 300;
  line-height: 1.5;
  z-index: 9999;
  white-space: normal;
  transform: translateY(-50%);
  word-break: break-word;
  word-wrap: break-word;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    border-width: 8px;
    border-style: solid;
    transform: translateY(-50%);
    z-index: 2;
  }

  &:before {
    right: 100%;
    border-color: transparent rgba($border, 0.5) transparent transparent;
  }

  &:after {
    right: calc(100% - 1px);
    border-color: transparent $background-main transparent transparent;
  }

  &-inner {
    max-height: 400px;
    overflow-y: auto;
  }

  &.at-right {
    &-start {
      transform: translateY(-17px);

      &:before,
      &:after {
        top: 17px;
      }
    }

    &-end {
      transform: translateY(calc(-100% + 17px));

      &:before,
      &:after {
        top: calc(100% - 17px);
      }
    }
  }

  &.at-top {
    &,
    &-start,
    &-end {
      transform: translate(-50%, calc(-100% + 7px));

      &:before,
      &:after {
        right: 50%;
        transform: translateX(50%);
      }

      &:before {
        top: 100%;
        border-color: rgba($border, 0.3) transparent transparent transparent;
      }

      &:after {
        $background-main: lighten($background-main, 6.25%);

        top: calc(100% - 1px);
        border-color: $background-main transparent transparent transparent;
      }
    }

    &-start {
      transform: translate(-17px, calc(-100% + 7px));

      &:before,
      &:after {
        right: calc(100% - 17px);
        transform: translateX(50%);
      }
    }

    &-end {
      transform: translate(calc(-100% + 18px), calc(-100% + 7px));

      &:before,
      &:after {
        right: 17px;
      }
    }

    .tool-tip-vue-inner {
      max-height: 160px;
    }
  }

  &.at-bottom {
    &,
    &-start,
    &-end {
      transform: translateX(-50%);

      &:before,
      &:after {
        right: 50%;
        transform: translateX(50%);
      }

      &:before {
        top: -16px;
        border-color: transparent transparent rgba($border, 0.5) transparent;
      }

      &:after {
        top: -15px;
        border-color: transparent transparent $background-main transparent;
      }
    }

    &-start {
      transform: translate(-17px, -2px);

      &:before,
      &:after {
        right: calc(100% - 17px);
      }
    }

    &-end {
      transform: translate(calc(-100% + 18px), -2px);

      &:before,
      &:after {
        right: 17px;
      }
    }
  }

  &.at-left {
    &,
    &-start,
    &-end {
      transform: translate(-100%, -50%);

      &:before {
        right: -16px;
        border-color: transparent transparent transparent rgba($border, 0.5);
      }

      &:after {
        $background-main: lighten($background-main, 6.25%);

        right: -15px;
        border-color: transparent transparent transparent $background-main;
      }
    }

    &-start {
      transform: translate(-100%, -17px);

      &:before,
      &:after {
        top: 17px;
      }
    }

    &-end {
      transform: translate(-100%, calc(-100% + 17px));

      &:before,
      &:after {
        top: calc(100% - 17px);
      }
    }
  }

  &.small {
    padding: 10px 8px;
    font-size: 10px;

    &:before,
    &:after {
      border-width: 6px;
    }

    &.at-bottom {
      &,
      &-start,
      &-end {
        &:before {
          top: -13px;
        }

        &:after {
          top: -12px;
        }
      }
    }

    &.at-left {
      &,
      &-start,
      &-end {
        &:before {
          right: -13px;
        }

        &:after {
          right: -12px;
        }
      }
    }
  }

  &.animated {
    transition: opacity 0.5s;
  }
}

.tool-tip-icon-wrap {
  position: relative;
  line-height: 0;
}

@media screen and (max-width: 400px) {
  .tool-tip-vue {
    left: 50% !important;
    max-width: calc(100vw - 64px) !important;
    transform: translateX(-50%) !important;

    &:before,
    &:after {
      display: none;
    }
  }
}
</style>

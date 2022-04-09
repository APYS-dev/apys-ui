<template>
  <teleport to="#endofbody">
    <vue-final-modal
      v-model="show"
      :name="name"
      :classes="classes"
      :overlay-class="overlayClass"
      :click-to-close="clickToClose"
      :esc-to-close="escToClose"
      :prevent-click="preventClick"
      :transition="transition"
      :overlay-transition="overlayTransition"
      :drag="drag"
      :resize="resize"
      :min-width="minWidth"
      :min-height="minHeight"
      :max-width="maxWidth"
      :max-height="maxHeight"
      :styles="styles"
      @before-close="$emit('before-close')"
      @before-open="beforeOpen"
      @opened="$emit('opened')"
    >
      <div
        class="vfm--modal-container"
        :style="[`max-width: ${maxWidth}px; min-width: ${minWidth}px; width: ${width}px; max-height: ${height}px;`]"
      >
        <button
          v-if="isShowCloseButton"
          type="button"
          class="vfm--modal-close"
          title="Close"
          @click="$emit('close-modal')"
        ></button>

        <div v-if="$slots['header']" class="vfm--modal-header" :class="headerClasses">
          <slot name="header"></slot>
        </div>

        <div v-if="$slots['content']" class="vfm--modal-content" :class="contentClasses">
          <slot name="content"></slot>
        </div>

        <div v-if="$slots['footer']" class="vfm--modal-footer" :class="footerClasses">
          <slot name="footer"></slot>
        </div>

        <slot></slot>
      </div>
    </vue-final-modal>
  </teleport>
</template>

<script>
export default {
  name: 'Gmodal',

  inheritAttrs: false,

  props: {
    name: {
      type: String,
      required: true,
    },
    classes: {
      type: [String, Object, Array],
      default: 'vfm--modal',
    },
    contentClass: {
      type: [String, Object, Array],
      default: '',
    },
    overlayClass: {
      type: [String, Object, Array],
      default: '',
    },
    styles: {
      type: [Object, Array],
      default: () => {},
    },
    transition: {
      type: [String, Object],
      default: 'vfm',
    },
    overlayTransition: {
      type: String,
      default: 'vfm',
    },
    clickToClose: {
      type: Boolean,
      default: true,
    },
    escToClose: {
      type: Boolean,
      default: true,
    },
    preventClick: {
      type: Boolean,
      default: false,
    },
    drag: {
      type: Boolean,
      default: false,
    },
    resize: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [Number, String],
      default: '100%',
    },
    height: {
      type: [Number, String],
      default: 'auto',
    },
    minWidth: {
      type: Number,
      default: 0,
    },
    minHeight: {
      type: Number,
      default: 0,
    },
    maxWidth: {
      type: Number,
      default: 950,
    },
    maxHeight: {
      type: Number,
      default: Infinity,
    },
    headerClasses: {
      type: [String, Array],
      default: '',
    },
    contentClasses: {
      type: [String, Array],
      default: '',
    },
    footerClasses: {
      type: [String, Array],
      default: '',
    },
    isShowCloseButton: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['before-open', 'before-close', 'close-modal', 'opened'],

  data: () => ({
    show: false,
  }),

  methods: {
    beforeOpen(event) {
      this.$emit('before-open', event);
    },
  },
};
</script>

<style lang="scss">
$border: rgba(0, 0, 0, 0.1);

.vfm {
  div.vfm__overlay.vfm--overlay {
    background-color: rgba(245, 245, 245, 0.8);
  }

  &--modal {
    display: flex;
    justify-content: center;
    align-items: center;

    &-container {
      position: relative;
      padding: 28px 36px;
      width: 100%;
      max-height: 100vh;
      background: #fff;
      border-radius: 4px;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;

        &-track {
          background-color: transparent;
        }

        &-thumb {
          background-color: #cbcbcb59;
          border-radius: 4px;
        }
      }
    }

    &-fullscreen {
      width: 100vw;
      height: 100vh;
    }

    &-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 24px;
      height: 24px;

      &:before,
      &:after {
        content: '';
        position: absolute;
        top: 11px;
        left: 2px;
        width: 22px;
        height: 1px;
        background-color: $border;
      }

      &:before {
        transform: rotate(45deg);
      }

      &:after {
        transform: rotate(-45deg);
      }
    }

    &-header {
      h3 {
        font-size: 18px;
        font-weight: 400;
        opacity: 0.8;
      }
    }

    &-content {
      font-size: 14px;
      font-weight: 300;
    }
  }
}
</style>

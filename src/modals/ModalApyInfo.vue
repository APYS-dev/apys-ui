<template>
  <VueFinalModal v-bind="$attrs" classes="vfm--modal">
    <div class="vfm--modal-container">
      <button
        type="button"
        class="vfm--modal-close"
        title="Close"
        @click="$emit('close')"
      ></button>

      <div class="vfm--modal-header">
        <h3 class="m-b-36">Apy info</h3>
      </div>

      <div class="vfm--modal-content modal">
        <div class="modal__inp-group">
          If you are curious to learn more about the APY details, you may
          consult the following
          <a
            target="_blank"
            href="https://en.wikipedia.org/wiki/Annual_percentage_yield"
            >link</a
          >
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>

<style lang="scss" scoped>
.modal {
  width: 380px;

  &__inp-group {
    &__paragraph {
      margin-bottom: 5px;
    }

    &__topic {
      margin-top: 8px;
      font-size: larger;
      font-weight: bolder;
    }
  }
}
</style>

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
        <h3 class="m-b-36">Rewards info</h3>
      </div>

      <div class="vfm--modal-content modal">
        <div class="modal__inp-group">
          <p class="modal__inp-group__paragraph">
            The platform offers APYS rewards to certain selected pools. If a
            project is looking to attract additional liquidity they have the
            option of utilizing our vaults. By purchasing APYS they could
            incentivize the preferred vaults and contribute to the protocol’s
            liquidity.
          </p>

          <p class="modal__inp-group__paragraph">
            Additional APYS rewards will be available in this case. We will
            prioritize adding the pools which were incentivized by the projects.
          </p>
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
  max-width: 480px;

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

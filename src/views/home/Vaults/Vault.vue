<template>
  <div class="vault-wrap">
    <!--    <div class="vault" @click="show = !show">-->
    <div class="vault">
      <div class="vault__name-wrap">
        <div class="vault__logo">
          <img
            v-for="token in depositTokens"
            :key="token"
            :alt="token.symbol"
            :src="`/static/images/tokens/${token.symbol}.svg`"
          />
        </div>

        <div class="vault__name">
          {{ name }}
        </div>

        <button v-if="uuid === 'ref-usdc-usdt-dai'" class="icon-info" @click.stop="showVaultModal"></button>
      </div>

      <div class="vault__dex">
        <span class="light-text">dex</span>
        <a :href="dexUrl" target="_blank">
          <img :src="`/static/images/dexes/${dex}.png`" alt="ref finance" />
        </a>
      </div>

      <div class="vault__bonus">
        <div class="light-text">
          +rewards
          <button class="icon-info" @click.stop="showRewardsModal"></button>
        </div>
        <div class="tokens">
          <template v-for="token in rewardTokens" :key="token">
            <img :alt="token" :src="`/static/images/tokens/${token}.svg`" />
          </template>
        </div>
      </div>

      <div class="vault__tvl">
        <span class="light-text">tvl</span>
        <div class="amount">{{ $formatPrice(tvl) }}</div>
      </div>

      <div class="vault__apy">
        <div class="light-text">
          apy
          <button class="icon-info" @click.stop="showApyModal"></button>
        </div>

        <div class="amount">
          {{ apy }}
          <button class="calculator" @click.stop="showCalcModal">
            <img alt="Calc" src="@/assets/img/calculator.png" />
          </button>
        </div>
      </div>

      <div class="vault__status">
        <div v-if="status === 'upcoming'" class="line line-position">coming</div>
      </div>
      <!--      <div :class="{ active: show }" class="vault__arrow">-->
      <!--        <img alt="↓" src="@/assets/img/arrow-down.png" />-->
      <!--      </div>-->
    </div>

    <vault-more
      :apr="apr"
      :contract-id="contractId"
      :deposit-tokens="depositTokens"
      :reward-tokens="rewardTokens"
      :show="show"
      :status="status"
      :uuid="uuid"
    ></vault-more>
  </div>

  <g-modal
    :click-to-close="true"
    :is-show-close-button="true"
    :max-width="580"
    :name="$id(`${uuid}-vault-info`)"
    @close-modal="closeVaultModal"
  >
    <template #header>
      <h3 class="m-b-36">Vault info</h3>
    </template>

    <template #content>
      <div v-if="uuid === 'ref-usdc-usdt-dai'" class="modal__inp-group">
        <p class="modal__inp-group__paragraph">
          This vault is designed around stablecoin LP farming. The contract provides a simple solution for the users to interact with the DEX contract and provide liquidity in a couple of clicks. By depositing the funds via APYS UI, the user transfers the funds directly to Ref Finance.

          The funds are then deposited by the DEX contract to add liquidity. The shares are then sent to the farming contract, while the APYS users enjoy the benefits of a convenient farming solution.
        </p>

        <div class="modal__inp-group__topic">Fee clarification:</div>

        <p class="modal__inp-group__paragraph">
          We would like to point out that Ref Finance has certain internal fees. Whenever funds are deposited into the vault or withdrawn from it, the pool takes a fee of <b>0.05%</b> and also offers a slippage tolerance of <b>0.2%</b>.

          As the TVL of the vault grows, it is becoming cheaper to interact with the DEX contract. Over time the fees will reduce for all of the participants from the growth of TVL. In addition, auto-compound fees are divided among all of the users, making it cheaper to interact with the platform. They may, however, take some time to auto-compound if the TVL is low.

        </p>

      </div>

      <div v-if="uuid === 'ref-abr-usdc'" class="modal__inp-group">

      </div>
    </template>
  </g-modal>

  <g-modal
      :click-to-close="true"
      :is-show-close-button="true"
      :max-width="580"
      :name="$id('rewards-info')"
      @close-modal="closeRewardsModal"
  >
    <template #header>
      <h3 class="m-b-36">Rewards info</h3>
    </template>

    <template #content>
      <div class="modal__inp-group">
        <p class="modal__inp-group__paragraph">
          The platform offers APYS rewards to certain selected pools. If a project is looking to attract additional
          liquidity they have the option of utilizing our vaults. By purchasing APYS they could incentivize the
          preferred vaults and contribute to the protocol’s liquidity.
        </p>

        <p class="modal__inp-group__paragraph">
          Additional APYS rewards will be available in this case. We will prioritize adding the pools which were
          incentivized by the projects.
        </p>
      </div>
    </template>
  </g-modal>

  <g-modal
    :click-to-close="true"
    :is-show-close-button="true"
    :max-width="580"
    :name="$id('apy-info')"
    @close-modal="closeApyModal"
  >
    <template #header>
      <h3 class="m-b-36">Apy info</h3>
    </template>

    <template #content>
      <div class="modal__inp-group">
        If you are curious to learn more about the APY details, you may consult the following
        <a target="_blank" href="https://en.wikipedia.org/wiki/Annual_percentage_yield">link</a>
      </div>
    </template>
  </g-modal>

  <modal-calc :apr="apr" :apy="apy" :name="$id('calc')"></modal-calc>
</template>

<script>
import ModalCalc from './ModalCalc.vue';
import VaultMore from './VaultMore.vue';
import { aprToApy } from '@/near/utils';

export default {
  name: 'Vault',

  components: { ModalCalc, VaultMore },

  props: {
    name: {
      type: String,
      required: true,
    },

    uuid: {
      type: String,
      required: true,
    },

    tvl: {
      type: [Number, String],
      required: false,
      default: 'n/a',
    },

    dex: {
      type: String,
      required: true,
    },

    dexUrl: {
      type: String,
      required: true,
    },

    apr: {
      type: [Number, String],
      required: true,
      default: 'n/a',
    },

    status: {
      type: String,
      required: true,
    },

    contractId: {
      type: [String],
      required: true,
    },

    depositTokens: {
      type: Array,
      required: true,
      default: () => [],
    },

    rewardTokens: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data: () => ({
    show: true,
    apy: 'n/a',
  }),

  mounted() {
    this.apy = `${aprToApy(this.apr, 365).toFixed(2)}%`;
  },

  methods: {
    showCalcModal() {
      this.$vfm.show(this.$id('calc'));
    },

    showVaultModal() {
      this.$vfm.show(this.$id(`${this.uuid}-vault-info`));
    },

    closeVaultModal() {
      this.$vfm.hide(this.$id(`${this.uuid}-vault-info`));
    },

    showApyModal() {
      this.$vfm.show(this.$id('apy-info'));
    },

    closeApyModal() {
      this.$vfm.hide(this.$id('apy-info'));
    },

    showRewardsModal() {
      this.$vfm.show(this.$id('rewards-info'));
    },

    closeRewardsModal() {
      this.$vfm.hide(this.$id('rewards-info'));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.vault-wrap {
  overflow: hidden;
  box-shadow: 0px -4px 50px rgba(47, 91, 96, 0.08);

  &:not(:first-child) {
    margin: 16px auto 0;
  }
}

.vault {
  padding: 16px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background-color: var(--background-color);
  border-radius: 4px;
  //cursor: pointer;
  position: relative;

  &__name-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 232px;
  }

  &__logo {
    display: flex;

    img {
      &:not(:last-child) {
        margin-right: -12px;
      }

      height: 31px;
      border: 3px solid #ffffff;
      border-radius: 20px;
    }
  }

  &__name {
    font-size: 14px;
    font-weight: 500;
  }

  &__dex,
  &__tvl,
  &__bonus,
  &__apy {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 34px;
    gap: 4px;

    .amount {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
    }

    .tokens {
      display: flex;
      flex-direction: row;
      gap: 4px;
    }

    .calculator img {
      width: 8px;
      height: 10px;
    }

    img {
      width: 19.2px;
    }

    button {
      width: 11px;
      height: 11px;
      font-size: 8px;
    }
  }

  &__status {
    display: flex;
    min-height: 34px;
    min-width: 40px;

    .line {
      color: var(--color-text);
      font-weight: 700;
      background: #f7c945;
      font-size: 16px;
      line-height: 24px;
    }

    .line-position {
      position: absolute;
      right: 0;
      top: 0;
      padding: 0 2em;
      transform-origin: left bottom;
      transform: translate(29.29%, -100%) rotate(45deg);
      text-indent: 0;
    }
  }

  &__arrow {
    display: flex;
    align-items: center;
    width: 21px;
    transition: all 0.3s;
    cursor: pointer;

    &.active {
      transform: rotate(180deg);
    }
  }

  .light-text {
    font-size: 11px;
    color: rgba(0, 0, 0, 0.3);
    text-transform: uppercase;
    height: 14px;
  }
}

.icon-info {
  display: inline-flex;
  cursor: pointer;
}

.modal {
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

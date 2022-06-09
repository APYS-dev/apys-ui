<template>
  <input
    :ref="$id('autoNumericElement')"
    :placeholder="placeholder"
    :value="valueNumber"
    class="amount-input"
    @input="setValueNumber"
    @keyup.enter="setValueNumber"
  />
</template>

<script>
import AutoNumeric from 'autonumeric/dist/autoNumeric.min.js';

const DEFAULT_OPTIONS = {
  allowDecimalPadding: true,
  caretPositionOnFocus: 'end',
  decimalPlaces: 2,
  modifyValueOnWheel: false,
  showWarnings: true,
  selectOnFocus: false,
  minimumValue: 0,
  emptyInputBehavior: 'null',
};

export default {
  name: 'GAutoNumeric',
  props: {
    modelValue: {
      type: [String, Number, null],
      required: true,
    },

    placeholder: {
      type: String,
      default() {
        return 'Enter value';
      },
    },

    options: {
      type: [Object, null],
      default() {
        return DEFAULT_OPTIONS;
      },
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      anElement: null,
      valueNumber: this.modelValue,
      optionsInput: {},
    };
  },

  watch: {
    modelValue(val) {
      this.anElement.set(val);
      this.setValueNumber();
    },
  },

  mounted() {
    this.manageOptionElement();
    this.anElement = new AutoNumeric(this.$refs[this.$id('autoNumericElement')], this.optionsInput);
  },

  methods: {
    setValueNumber() {
      this.$emit('update:modelValue', this.anElement.rawValue);
      this.valueNumber = this.anElement.rawValue;
    },

    manageOptionElement() {
      this.optionsInput = {
        ...DEFAULT_OPTIONS,
        ...this.options,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.amount-input::placeholder {
  color: var(--color-main-90);
}
</style>

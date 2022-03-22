<template>
  <input :ref="$id('autoNumericElement')" :value="valueNumber" @input="setValueNumber" @keyup.enter="setValueNumber" />
</template>

<script>
import AutoNumeric from 'autonumeric/dist/autoNumeric.min.js';

const DEFAULT_OPTIONS = {
  allowDecimalPadding: true,
  caretPositionOnFocus: 'end',
  decimalPlaces: 0,
  modifyValueOnWheel: false,
  showWarnings: true,
  selectOnFocus: false,
  minimumValue: 0,
};

export default {
  name: 'GAutoNumeric',
  props: {
    modelValue: {
      type: [String, Number, null],
      required: true,
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
      this.anElement.set(val || 0);
      this.setValueNumber();
      return;
    },
  },

  mounted() {
    this.manageOptionElement();
    this.anElement = new AutoNumeric(this.$refs[this.$id('autoNumericElement')], this.optionsInput);

    this.anElement.set(this.modelValue?.toString() || 0);
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

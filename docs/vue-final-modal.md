# https://vue-final-modal.org/

```
<template>
  <vue-final-modal
    :name="null"
    :value="false"
    :ssr="true"
    :classes="false"
    overlay-class=""
    content-class=""
    styles=""
    overlay-style=""
    content-style=""
    :lock-scroll="true"
    :hide-overlay="false"
    :click-to-close="true"
    :esc-to-close="false"
    :prevent-click="false"
    :attach="false"
    transition="vfm"
    overlay-transition="vfm"
    :z-index-auto="true"
    :z-index-base="1000"
    :z-index="false"
    :focus-retain="true"
    :focus-trap="false"
    :fit-parent="true"
    :drag="false"
    drag-selector=""
    :keep-changed-style="false"
    :resize="false"
    :resize-directions="['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']"
    :min-width="0"
    :min-height="0"
    :max-width="Infinity"
    :max-height="Infinity"
  >
    ...modal content
  </vue-final-modal>
</template>
```

### Demo

[liveDemo](https://vue-final-modal.org/examples/liveDemo)

### Docs

[PROPERTIES](https://vue-final-modal.org/guide/properties)

[EVENTS](https://vue-final-modal.org/guide/events)

[PARAMS](https://vue-final-modal.org/guide/params)

[SCOPED-SLOTS](https://vue-final-modal.org/guide/scoped-slots)

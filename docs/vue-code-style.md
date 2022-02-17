# Codestyle vue:

### _Multi-word component names:_

Component names should always be multi-word, except for root App components, and built-in components provided by Vue, such as **transition**.

This prevents conflicts with existing and future HTML elements, since all HTML elements are a single word.

- **Bad**:

```
export default {
  name: 'Todo'
}
```

- **Good**:

```
export default {
  name: 'TodoItem'
}

```

### _Prop definitions should be as detailed as possible:_

- **Bad**:

```
props: ['status']
```

- **Good**:

```
props: {
  status: {
    type: String,
    required: true,
    //...
  }
}
```

### _Avoid v-if with v-for:_

Never use v-if on the same element as v-for

- **Bad**:

```
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id">
    {{ user.name }}
  </li>
</ul>
```

- **Good**:

```
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

### _Single-file component filename casing:_

Filenames of single-file components should be always PascalCase

```
MyComponent.vue
```

### _Full-word component names:_

**Component names should prefer full words over abbreviations.**

The autocompletion in editors make the cost of writing longer names very low, while the clarity they provide is invaluable. Uncommon abbreviations, in particular, should always be avoided.

**Bad**

```
components/
  |- SdSettings.vue
  |- UProfOpts.vue
```

**Good**

```
components/
  |- StudentDashboardSettings.vue
  |- UserProfileOptions.vue
```

### _Global components:_

Filenames of global components should be kebab-case and with prefix "g-"

```
g-component.vue
```

### _Single-instance component names:_

Components that should only ever have a single active instance should begin with the **The** prefix, to denote that there can be only one.

**Bad**:

```
Header.vue
```

**Good**:

```
TheHeader.vue
```

### _Tightly coupled component names_

Child components that are tightly coupled with their parent should include the parent component name as a prefix.

**Example**

```
   IdoPage.vue
   IdoPage/
           IdoInfo.vue
           IdoPrime.vue
           IdoStats.vue
```

### _Order of words in component names_

Component names should start with the highest-level (often most general) words and end with descriptive modifying words.

**Bad**

```
   components/
      |- ClearSearchButton.vue
      |- ExcludeFromSearchInput.vue
      |- LaunchOnStartupCheckbox.vue
      |- RunSearchButton.vue
      |- SearchInput.vue
      |- TermsCheckbox.vue
```

**Good**

```
   components/
      |- SearchButtonClear.vue
      |- SearchButtonRun.vue
      |- SearchInputQuery.vue
      |- SearchInputExcludeGlob.vue
      |- SettingsCheckboxTerms.vue
      |- SettingsCheckboxLaunchOnStartup.vue
```

### _Self-closing components_

Components that self-close communicate that they not only have no content, but are meant to have no content. It's the difference between a blank page in a book and one labeled "This page intentionally left blank." Your code is also cleaner without the unnecessary closing tag.

**Bad**

```
<MyComponent></MyComponent>
```

**Good**

```
<MyComponent/>
```

### _Multi-attribute elements_

Elements with multiple attributes should span multiple lines, with one attribute per line.

**Bad**

```
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

**Good**

```
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

### _Simple expressions in templates_

**Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods.**

Complex expressions in your templates make them less declarative. We should strive to describe what should appear, not how we're computing that value. Computed properties and methods also allow the code to be reused

**Bad**

```
{{ fullName.split(' ').reverse().join(' ') }}
```

**Good**

```
{{ reverseFullName }}
```

```
computed: {
  reverseFullName() {
    return this.fullName.split(' ').reverse().join(' ');
  }
}
```

### _Simple computed properties_

**Complex computed properties should be split into as many simpler properties as possible.**

**Bad**

```
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```

**Good**

```
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```

### _Directive shorthands_

**Directive shorthands (: for v-bind:, @ for v-on: and # for v-slot) should be used always or never.**

**Bad**

```
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

**Good**

```
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
<input
  @input="onInput"
  @focus="onFocus"
>
```

### _Component/instance options order_

1. **Global Awareness** (requires knowledge beyond the component)

- name

2. **Template Compiler Options** (changes the way templates are compiled)

- compilerOptions

3. **Template Dependencies** (assets used in the template)

- components
- directives

4. **Composition** (merges properties into the options)

- extends
- mixins
- provide/inject

5. **Interface** (the interface to the component)

- inheritAttrs
- props
- emits
- expose

6. **Composition API** (the entry point for using the Composition API)

- setup

7. **Local State** (local reactive properties)

- data
- computed

8. **Events** (callbacks triggered by reactive events)

- watch
- Lifecycle Events (in the order they are called)
- - beforeCreate
- - created
- - beforeMount
- - mounted
- - beforeUpdate
- - updated
- - activated
- - deactivated
- - beforeUnmount
- - unmounted
- - errorCaptured
- - renderTracked
- - renderTriggered

9. **Non-Reactive Properties** (instance properties independent of the reactivity system)

- methods

10. **Rendering** (the declarative description of the component output)

- template/render

### _Element attribute order_

1. **Definition** (provides the component options)

- is

2. **List Rendering** (creates multiple variations of the same element)

- v-for

3. **Conditionals** (whether the element is rendered/shown)

- v-if
- v-else-if
- v-else
- v-show
- v-cloak

4. **Render Modifiers** (changes the way the element renders)

- v-pre
- v-once

5. **Global Awareness** (requires knowledge beyond the component)

- id

6. **Unique Attributes** (attributes that require unique values)

- key
- ref

7. **Two-Way Binding** (combining binding and events)

- v-model

8. **Other Attributes** (all unspecified bound & unbound attributes)

9. **Events** (component event listeners)

- v-on

10. **Content** (overrides the content of the element)

- v-html
- v-text

### _Empty lines in component/instance options_

**You may want to add one empty line between multi-line properties, particularly if the options can no longer fit on your screen without scrolling**

**Example**

```
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
}
```

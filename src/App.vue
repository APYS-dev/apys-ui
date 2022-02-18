<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    |
    <router-link to="/components">Components</router-link>
  </div>
  <router-view />
</template>

<style lang="scss">
#app {
  background-color: #ddd;
}

#nav {
  margin: 0 auto;
  width: max-content;
}
</style>

/**
 * Vue 3 version of vue-unique-id
 */

const methods = {
  /**
   * Generate a component-scoped unique HTML identifier.
   *
   * Example: $id('my-id') => 'uid-42-my-id'
   *
   * @param {string} id id to scope
   */
  $idFactory(uidProperty) {
    return function $id(id = '') {
      return `${this[uidProperty]}-${id}`;
    };
  },

  /**
   * Generate a component-scoped unique HTML identifier reference. Prepends '#' to the id generated
   * by the call $id(id).
   *
   * Example: $idRef('my-id') => '#uid-42-my-id'
   *
   * @param {string} id id to scope
   */
  $idRef(id) {
    return `#${this.$id(id)}`;
  },
};

const DEFAULTS = {
  // {string} Property name of the component's unique identifier. Change this if 'vm.uid' conflicts
  // with another plugin or your own props.
  uidProperty: 'uid',

  // {string} Prefix to use when generating HTML ids. Change this to make your ids more unique on a
  // page that already uses or could use a similar naming scheme.
  uidPrefix: 'uid-',
};

export default function install(app, options = {}) {
  // Don't use object spread to merge the defaults because bublé transforms that to Object.assign
  const uidProperty = options.uidProperty || DEFAULTS.uidProperty;
  const uidPrefix = options.uidPrefix || DEFAULTS.uidPrefix;

  // Assign a unique id to each component
  let uidCounter = 0;
  app.mixin({
    beforeCreate() {
      uidCounter += 1;
      const uid = uidPrefix + uidCounter;
      Object.defineProperties(this, {
        [uidProperty]: {
          get() {
            return uid;
          },
        },
      });
    },
  });

  app.config.globalProperties.$id = methods.$idFactory(uidProperty);
  app.config.globalProperties.$idRef = methods.$idRef;
}

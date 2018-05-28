function getNavbarOptions (vm) {
  const {title, navbar} = vm.$options
  let opts
  if (navbar) {
    opts = typeof navbar === 'function'
      ? navbar.call(vm)
      : navbar
  }
  if (title) {
    if (!opts) {
      opts = {}
    }
    opts.title = typeof title === 'function'
      ? title.call(vm)
      : title
  }
  return opts
}

const navbarMixin = {
  data: () => ({
    waiting: false
  }),
  created () {
    this.updateNavbar()
  },
  watch: {
    '$route' () {
      this.updateNavbar()
    },
    'waiting' () {
      this.updateNavbar()
    }
  },
  methods: {
    updateNavbar () {
      const nav = getNavbarOptions(this)
      if (nav) {
        if (nav.title) {
          document.title = `${nav.title}`
        }
        this.$store.commit('mutateNavbar', nav)
      }
    }
  }
}
export default navbarMixin

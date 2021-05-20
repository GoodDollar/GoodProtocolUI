export const formatterMixin = {
  methods: {
    formatBalance (value, currency) {
      if (typeof value !== 'number')
        value = parseFloat(value)
      if (isNaN(value))
        value = 0
      switch (currency) {
        case 'gd':
          return (value / 100).toFixed(2) + ' G$'
        case 'eth':
        default:
          return value.toFixed(5) + ' eth'
      }
    }
  }
}

module.exports = {
  // use root-relative path
  publicPath: '',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  devServer: {
    // uncomment for local https
    //https: true, port: 8443
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      // add version code into page title
      let title = 'G$ Protocol'
      if (typeof process.env.deploy_tag !== 'undefined') {
        title += ' ' + process.env.deploy_tag
      }
      args[0].title = title
      return args
    })
  },
  configureWebpack: {
    optimization: {
      // disable minification to resolve issue with ES6 + terser
      minimize: false,
    }
  }
}

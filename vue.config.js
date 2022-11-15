const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/weight-manager/'
    : '/',
  chainWebpack: (config) => {
    config.optimization.splitChunks({
      chunks: 'all',
    })
  },
})

const { defineConfig } = require('@vue/cli-service')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/weight-manager/'
    : '/',
  configureWebpack: {
    plugins: [
      process.env.NODE_ENV !== 'production' && new BundleAnalyzerPlugin(),
    ],
  },
  chainWebpack: (config) => {
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          priority: 10,
          test: /[\\/]node_modules[\\/]/,
        },
        gsap: {
          name: 'chunk-gsap',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?gsap(.*)/,
        },
        luxon: {
          name: 'chunk-luxon',
          priority: 25,
          test: /[\\/]node_modules[\\/]_?luxon(.*)/,
        },
        echarts: {
          name: 'chunk-echarts',
          priority: 30,
          test: /[\\/]node_modules[\\/]_?echarts(.*)/,
        },
      },
    })
  },
})

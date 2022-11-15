const { defineConfig } = require('@vue/cli-service')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const TerserPlugin = require('terser-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
  publicPath: isProduction
    ? '/weight-manager/'
    : '/',
  configureWebpack: {
    plugins: [
    ].concat(isProduction ? [] : [new BundleAnalyzerPlugin()]),
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          minify: TerserPlugin.uglifyJsMinify,
          terserOptions: {
            compress: true,
          },
          test: /\.js(\?.*)?$/i,
        }),
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            priority: 10,
            test: /[\\/]node_modules[\\/]/,
          },
          luxon: {
            name: 'chunk-luxon',
            priority: 15,
            test: /[\\/]node_modules[\\/]_?luxon(.*)/,
          },
          gsap: {
            name: 'chunk-gsap',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?gsap(.*)/,
          },
          firebase: {
            name: 'chunk-firebase',
            priority: 25,
            test: /[\\/]node_modules[\\/]_?@firebase(.*)/,
          },
          echarts: {
            name: 'chunk-echarts',
            priority: 30,
            test: /[\\/]node_modules[\\/]_?echarts(.*)/,
          },
          vue: {
            name: 'chunk-vue',
            priority: 35,
            test: /[\\/]node_modules[\\/]_?@vue(.*)/,
          },
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.plugins.delete('prefetch')
  },
})

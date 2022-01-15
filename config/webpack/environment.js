const { environment } = require('@rails/webpacker')
const { VueLoaderPlugin } = require('vue-loader')
const vue = require('./loaders/vue')

environment.splitChunks()
environment.plugins.prepend('VueLoaderPlugin', new VueLoaderPlugin())
environment.config.resolve.alias = { 'vue$': 'vue/dist/vue.esm.js' };
environment.loaders.prepend('vue', vue)


module.exports = environment

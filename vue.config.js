const { defineConfig } = require('@vue/cli-service')
var version = new Date()
const HttpsProxyAgent = require('https-proxy-agent')
const proxyServer = process.env.http_proxy || 'http://192.168.1.71:21081'
const agent = new HttpsProxyAgent(proxyServer)
module.exports = defineConfig({
  devServer: {
    port: 8089,
    host: '0.0.0.0',
    open: true,
    // https: true
    proxy: {
      //配置跨域
      '/api2': {
        target: 'http://10.0.0.110:8006/',
        changOrigin: true, //允许跨域
        pathRewrite: {
          '^/api2': '/api2',
        },
      },
      '/webapp': {
        target: 'http://10.0.0.110/',
        changOrigin: true, //允许跨域
        agent,
        pathRewrite: {
          '^/webapp': '/webapp',
        },
      },
      '/api': {
        target: 'http://10.0.0.215:8428/',
        changOrigin: true, //允许跨域
        pathRewrite: {
          '^/api': '/api',
        },
      },
      '/socket': {
        target: 'ws://10.0.0.215:8090/', //后端目标接口地址
        changeOrigin: true, //是否允许跨域
        pathRewrite: {
          '^/socket': '', //重写,
        },
        ws: false, //开启ws
        secure: false,
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '管理平台'
      return args
    }),
      config.plugin('define').tap((args) => {
        args[0]['process.env'].version = JSON.stringify(version)
        return args
      })
  },
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'project',
  assetsDir: 'static',
  indexPath: 'index.html',
  lintOnSave: false,
  transpileDependencies: true,
  productionSourceMap: false,
})

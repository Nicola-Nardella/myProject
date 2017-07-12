var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack')
var config = require('./webpack.config.js')
var path = require('path')

var compiler = webpack(config)

var server = new WebpackDevServer(compiler, {
  hot: true,
  filename: config.output.filename,
  publicPath: config.output.publicPath,
  public: 'soft4lawyer.dev:8081',
  stats: {
    colors: true,
  }
})
server.listen(8081, 'localhost', function() {})
// 192.168.0.13

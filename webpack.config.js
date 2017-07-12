var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var {PATHS} = require('./app.config')

const extractSass = new ExtractTextPlugin({
    filename: "main.css",
    disable: process.env.NODE_ENV === "development"
})

module.exports = {
  entry: [
    PATHS.scripts.src,
    PATHS.styles.src,
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://soft4lawyer.dev:8081',
  ],
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    extractSass
  ],
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: ['css-hot-loader'].concat(extractSass.extract({
          use: [
            {loader: "css-loader"},
            {loader: "sass-loader"},
            {loader: "import-glob-loader"},
          ],
          fallback: 'style-loader',
        }))
      },
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: [{loader: 'react-hot-loader'}, {loader: 'babel-loader'}],
      }
    ]
  },
  output: {
    publicPath: '/build/',
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  }
}

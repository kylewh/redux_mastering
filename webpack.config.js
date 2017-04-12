const path = require('path')
const webpack =require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const VENDOR_LIST = [
  'react',
  'redux', 
  'react-redux', 
  'react-dom', 
]

module.exports = {
  entry: {
    bundle: './src/index.js',
    vendor: VENDOR_LIST
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
}
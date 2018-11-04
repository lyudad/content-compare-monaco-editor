const HtmlWebPackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path')

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./public/index.html",
  filename: "index.html"
});

module.exports = {
    entry: "./src/index.js",
    output: {
      path: path.resolve('dist'),
      filename: 'bundled.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
            test: /\.css$/,
            use: [
                {
                  loader: "style-loader"
                },
                {
                  loader: "css-loader",
                }
              ]
        },
        {
            test: /\.svg$/,
            use: [{
                loader: 'svg-inline-loader'
            }]
        }
      ]
    },
    plugins: [
        htmlWebpackPlugin,
        new MonacoWebpackPlugin()
    ]
  };
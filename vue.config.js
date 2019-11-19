const path = require('path');

module.exports = {
  chainWebpack: config => {
    config.merge({
      devServer: {
        watchContentBase: true
      },
      resolve: {
        alias: {
          'contracts': path.resolve(__dirname, 'build/contracts')
        }
      },
      module: {
        rules: [
          {
            test: /\.(png|jpg|svg)$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }
        ]
      }
    });
  }
};

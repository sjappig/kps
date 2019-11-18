module.exports = {
  devServer: {
    watchContentBase: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
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
};

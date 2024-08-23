const webpack = require('webpack');

module.exports = {
  // ... otras opciones
  transpileDependencies: [
    // ... otras dependencias
    '@babel/plugin-transform-private-methods'
  ],
  configureWebpack: {
    plugins: [
      // ... otros plugins
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        global: require.resolve('global')
      })
    ],
    resolve: {
      fallback: {
        buffer: require.resolve('buffer/'),
        global: require.resolve('global/')
      }
    }
  },
  devServer: {
    port: 8080,
  }
};
module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '/cat/' : '/',
  devServer: {
    proxy: 'http://localhost:1323',
  }
}
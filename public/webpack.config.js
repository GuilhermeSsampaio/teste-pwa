const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
  // outras configurações do webpack
  plugins: [
    new InjectManifest({
      swSrc: './src/service-worker.js',
      swDest: 'service-worker.js',
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
    }),
  ],
};
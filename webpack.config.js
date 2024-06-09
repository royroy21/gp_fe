const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add polyfills for Node.js modules
  config.resolve.alias = {
    ...config.resolve.alias,
    crypto: 'crypto-browserify',
    stream: 'stream-browserify',
    vm: 'vm-browserify',
    zlib: 'browserify-zlib'
  };

  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    vm: require.resolve('vm-browserify'),
    zlib: require.resolve('browserify-zlib'),
    assert: require.resolve('assert/'),
    buffer: require.resolve('buffer/'),
    events: require.resolve('events/'),
    util: require.resolve('util/'),
    path: require.resolve('path-browserify')
  };

  return config;
};

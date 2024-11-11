module.exports = function override(config, env) {
    // Add polyfills for node core modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      path: require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      vm: require.resolve("vm-browserify"),
      process: require.resolve("process/browser"),
      os: require.resolve("os-browserify/browser"),
    };
  
    return config;
  };
  
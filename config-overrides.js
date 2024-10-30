module.exports = function override(config, env) {
    
    config.resolve.fallback = {
        
        ...config.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
        "vm": require.resolve("vm-browserify"),
        "process": require.resolve("process/browser"),

    };
    return config;
};

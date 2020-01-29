module.exports = function override(config, env) {
  // make sure webWorkers have the right global.
  config.output.globalObject = 'this';
  // compile workers.
  config.module.rules.unshift({
    test: /\.worker\.ts$/,
    use: { loader: 'worker-loader' }
  });
  return config;
}
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = function override(config, env) {
  // make sure webWorkers have the right global.
  config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;
  // compile workers.
  config.module.rules.unshift({
    test: /\.worker\.ts$/,
    use: { loader: 'worker-loader' }
  });
  // circular deps
  config.plugins.push(
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      // exclude: /node_modules/,
      // include specific files based on a RegExp
      include: /src/,
      // add errors to webpack instead of warnings
      failOnError: false,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    })
  );
  return config;
}
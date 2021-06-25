function config(entry = []) {
  return [...entry, require.resolve("./dist/esm/preset/preview")];
}

function managerEntries(entry = []) {
  return [...entry, require.resolve("./dist/esm/preset/manager")];
}

function webpack(webpackConfig = {}, options = {}) {
  const { module = {} } = webpackConfig;
  const { loaderOptions, rule = {} } = options;

  return {
    ...webpackConfig,
    module: {
      ...module,
      rules: [
        ...(module.rules || []),
        {
          test: [/\.stories\.(jsx?$|tsx?$)/],
          ...rule,
          enforce: 'pre',
          use: [
            {
              loader: require.resolve('./dist/cjs/source-loader/loader.js'),
              options: loaderOptions,
            },
          ],
        },
      ],
    },
  };
}

module.exports = {
  managerEntries,
  config,
  webpack,
};

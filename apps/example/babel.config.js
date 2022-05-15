const path = require('path');

const packagesPath = path.join(__dirname, '../..', 'packages');
// const rootNodeModules = path.join(__dirname, '../..', 'node_modules');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '^@crosscement/(.+)': `${packagesPath}/\\1/src`,
            // Major Hack : Fix later, Resolve to root react to prevent invalid hook call error
            // 'react': `${rootNodeModules}/react`,
          },
        },
      ],
    ],
  };
};

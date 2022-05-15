const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

const workspaceRoot = path.resolve(__dirname, '../..');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    include: path.resolve(workspaceRoot, 'packages'),
    use: 'babel-loader',
  });

  // We need to make sure that only one version is loaded for peerDependencies
  // So we alias them to the versions in example's node_modules
  // Object.assign(config.resolve.alias, {
  //   // Major Hack : Fix later, Resolve to workspaceRoot react to prevent invalid hook call error
  //   'react': path.join(workspaceRoot, 'node_modules', 'react'),
  // });

  return config;
};

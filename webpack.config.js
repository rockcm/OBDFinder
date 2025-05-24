const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add environment variables to the webpack DefinePlugin
  const definePlugin = config.plugins.find(plugin => plugin.constructor.name === 'DefinePlugin');
  
  if (definePlugin) {
    definePlugin.definitions['process.env.YOUTUBE_API_KEY'] = JSON.stringify(process.env.YOUTUBE_API_KEY);
  } else {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.YOUTUBE_API_KEY': JSON.stringify(process.env.YOUTUBE_API_KEY),
      })
    );
  }
  
  return config;
}; 
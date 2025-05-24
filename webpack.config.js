const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');

module.exports = async function (env, argv) {
  // Start with the default Expo webpack config
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ensure YOUTUBE_API_KEY is available during the build process
  const youtubeApiKey = process.env.YOUTUBE_API_KEY || '';
  console.log(`Webpack build: YOUTUBE_API_KEY is ${youtubeApiKey ? 'defined' : 'NOT defined'}`);

  // Add our DefinePlugin configuration
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.YOUTUBE_API_KEY': JSON.stringify(youtubeApiKey)
    })
  );

  // If you have other plugins that might conflict, you might need to be more careful
  // For example, ensuring this runs after certain Expo plugins or merging definitions.
  // But for a single variable, this direct push is usually fine.

  return config;
}; 
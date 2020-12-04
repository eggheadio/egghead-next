const path = require('path')
const webpack = require('webpack')
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: (config) => {
    // Resolve aliases like "import utils/time-utils"
    config.resolve.modules.push(process.cwd() + '/node_modules')
    config.resolve.modules.push(process.cwd() + '/src')

    // Necessary to "mock" next/image in Storybook land
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.__NEXT_IMAGE_OPTS': JSON.stringify({
          deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
          imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
          domains: [],
          path: '/',
          loader: 'default',
        }),
      }),
    )

    // Remove the existing css rule
    config.module.rules = config.module.rules.filter(
      (f) => f.test.toString() !== '/\\.css$/',
    )

    // Add loader to process CSS
    config.module.rules.push({
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader', 'postcss-loader'],
      include: path.resolve(__dirname, '../'),
    })

    return config
  },
}

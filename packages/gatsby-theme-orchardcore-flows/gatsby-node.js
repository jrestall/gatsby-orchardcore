require('ts-node').register()
const path = require('path')
const Debug = require('debug')
const { registerBuilder } = require('gatsby-theme-orchardcore-contents/src')
const FlowsBuilder = require('./src/FlowsBuilder').default

/**
 * Register the FlowsBuilder so that it can help build GatsbyJS pages.
 */
registerBuilder(FlowsBuilder)

/**
 * When shipping NPM modules, they typically need to be either
 * pre-compiled or the user needs to add bundler config to process the
 * files. Gatsby lets us ship the bundler config *with* the theme, so
 * we never need a lib-side build step.  Since we dont pre-compile the
 * theme, this is how we let webpack know how to process files.
 */
exports.onCreateWebpackConfig = ({ stage, loaders, plugins, actions }) => {
  const debug = Debug('gatsby-theme-orchardcore-flows:onCreateWebpackConfig')
  debug('ensuring Webpack will compile theme code')
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.dirname(
            require.resolve('gatsby-theme-orchardcore-flows')
          ),
          use: [loaders.js()],
        },
      ],
    },
  })
}

const Debug = require('debug')
const { createFilePath } = require('gatsby-source-filesystem')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')

// make sure src/pages exists for the filesystem source or it will error
exports.onPreBootstrap = ({ store }) => {
  const debug = Debug('gatsby-theme-orchardcore-pages:onPreBoostrap')

  const { program } = store.getState()
  const dir = `${program.directory}/src/pages`
  debug(`ensuring ${dir} exists`)

  if (!fs.existsSync(dir)) {
    debug(`creating ${dir}`)
    mkdirp.sync(dir)
  }
}

/**
 * When shipping NPM modules, they typically need to be either
 * pre-compiled or the user needs to add bundler config to process the
 * files. Gatsby lets us ship the bundler config *with* the theme, so
 * we never need a lib-side build step.  Since we dont pre-compile the
 * theme, this is how we let webpack know how to process files.
 */
exports.onCreateWebpackConfig = ({ stage, loaders, plugins, actions }) => {
  const debug = Debug('gatsby-theme-orchardcore-pages:onCreateWebpackConfig')
  debug('ensuring Webpack will compile theme code')
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.dirname(
            require.resolve('gatsby-theme-orchardcore-pages')
          ),
          use: [loaders.js()],
        },
      ],
    },
  })
}

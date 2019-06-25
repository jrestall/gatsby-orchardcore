require('ts-node').register()
const path = require('path')
const Debug = require('debug')
const WidgetSearcher = require('./src/WidgetSearcher').default
const WidgetStore = require('./src/WidgetStore').default
const FlowPartFragment = require('./src/FlowPartFragment').default

/**
 * Finds all widget fragments and automatically includes them in the FlowPart fragment.
 */
exports.onPreBootstrap = async ({ store, actions, reporter }) => {
  const { createNode } = actions
  const program = store.getState().program

  console.log('Searching for widgets...')

  // Find all widgets based on presence of 'export const widget = graphql'
  const widgetSearcher = new WidgetSearcher(program.directory, store, reporter)
  const widgets = await widgetSearcher.find()

  if (!widgets) {
    console.warn(`gatsby-theme-orchardcore-flows didn't find any widgets!`)
    return
  }

  // Save the list of widgets to the redux store so that we can use them later in buildFlowComponent.
  const widgetStore = new WidgetStore(createNode)
  widgetStore.save(widgets)

  // Build the FlowPart graphql fragment based on all the widgets.
  // e.g.
  // fragment FlowPart on CMS_FlowPart {
  //  ...Button
  //  ...Form
  //  ...Paragraph
  // }
  // This can be then used to query for all widgets and their details on a content item.
  const fragment = new FlowPartFragment(widgets)
  await fragment.saveToDisk(
    `${program.directory}/.cache/fragments/orchardcore-flows-fragments.js`
  )
}

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

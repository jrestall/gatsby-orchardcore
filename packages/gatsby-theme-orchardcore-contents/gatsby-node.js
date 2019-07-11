require('ts-node').register()
const path = require('path')
const Debug = require('debug')
const fs = require('fs')
const mkdirp = require('mkdirp')
const { writeFileSync } = require('fs-extra')
const createTemplate = require('./src/createTemplate').default
const { getBuilders } = require('./src/BuilderRegistry')


exports.createPages = async ({
  store,
  graphql,
  actions,
  reporter,
  ...other
}) => {
  const debug = Debug('gatsby-theme-orchardcore-contents:createPages')
  const {
    createPage
  } = actions

  const contentBuilders = getContentBuilders({
    store,
    graphql,
    actions,
    reporter,
    ...other
  })

  let operations = []
  let fragments = []
  for (let builder of contentBuilders) {
    await builder.buildQuery(operations, fragments)
  }

  const data = await executeContentQuery(operations, fragments, graphql)

  if (!data || !data.cms || !data.cms.contents) {
    reporter.panic('Could not query the CMS!')
    return
  }

  console.log('Building Content Pages.')
  const contents = data.cms.contents
  for (let content of contents) {
    if (!content) {
      continue
    }

    const contentPath = content.path
    if (!contentPath) {
      console.warn(`Content item found without a path property. Cannot create page!`)
      return
    }

    let widgetDefinitions = []
    for (let builder of contentBuilders) {
      builder.buildWidgets(content, widgetDefinitions)
    }

    let activeWidgets = []
    for (let builder of contentBuilders) {
      builder.setActiveWidgets(content, activeWidgets, widgetDefinitions, data)
    }

    const template = createTemplate(activeWidgets, widgetDefinitions)

    if (!template || template.length <= 0) {
      console.log(`Couldn't create template file for ${contentPath}`)
      return
    }

    console.log(`Creating template ${content.displayText} for ${contentPath}`)

    const templateName = contentPath.replace(/[^a-z0-9]+/gi, '')
    const templatePath = saveTemplate(templateName, template, store)

    for (let builder of contentBuilders) {
      builder.createPage(content, template, data)
    }

    createPage({
      component: templatePath,
      context: {
        contentItemId: content.contentItemId,
        contentItem: content
      },
      path: contentPath,
    })
  }
}

async function executeContentQuery(operations, fragments, graphql) {
  const contentQuery = `
    query ContentQuery {
      ${operations.join('\n')}
    }
    ${fragments.join('\n')}
  `
  console.log(`Executing content query: ${contentQuery}`)

  const result = await graphql(contentQuery)

  if (result.errors) {
    console.log(result.errors)
    throw new Error(result.errors)
  }

  return result.data
}

function newBuilder(builderClass, arguments) { 
  return 
}

// Gets all registered builder classes and dynamically 
// contructs them whilst injecting dependencies.
function getContentBuilders(dependencies) {
  const builderClasses = getBuilders()
  const contentBuilders = []
  for (builderClass of builderClasses) {
    if(!builderClass) {
      continue
    }
    contentBuilders.push(new builderClass(dependencies))
  }
  return contentBuilders
}

function saveTemplate(name, pageTemplate, store) {
  // Save to cache and return file path
  const program = store.getState().program
  const pageTemplatesDir = `${program.directory}/.cache/page-templates`
  ensureDirectory(pageTemplatesDir)

  const templatePath = `${pageTemplatesDir}/${name}.jsx`
  writeFileSync(templatePath, pageTemplate)

  return templatePath
}

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
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
exports.onCreateWebpackConfig = ({
  stage,
  loaders,
  plugins,
  actions
}) => {
  const debug = Debug('gatsby-theme-orchardcore-flows:onCreateWebpackConfig')
  debug('ensuring Webpack will compile theme code')
  actions.setWebpackConfig({
    module: {
      rules: [{
        test: /\.js$/,
        include: path.dirname(
          require.resolve('gatsby-theme-orchardcore-flows')
        ),
        use: [loaders.js()],
      }, ],
    },
  })
}
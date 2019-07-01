const Debug = require('debug')
const { createFilePath } = require('gatsby-source-filesystem')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const apiRunnerNode = require(`gatsby/dist/utils/api-runner-node`)
const { writeFileSync } = require('fs-extra')

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

exports.createPages = async ({ store, graphql, actions, getNodesByType, reporter }) => {
  const debug = Debug('gatsby-theme-orchardcore-pages:createPages')
  const { createPage } = actions

  let pageQuery = ''
  let queryOperations = ``
    
  const addFragments = fragments => pageQuery += fragments
  const addOperations = operations => queryOperations += operations
  await apiRunnerNode(`sourcePageQuery`, { addFragments, addOperations })

  pageQuery += `
    query PageQuery {
      cms { 
        page(status: PUBLISHED) {
          ...Page
        }
      }
      ${queryOperations}
    }`

  console.log(`Built page query: ${pageQuery}`)

  const result = await graphql(pageQuery)

  if (result.errors) {
    console.log(result.errors)
    throw new Error(result.errors)
  }

  if (!result.data || !result.data.cms) {
    reporter.panic('Could not query the CMS for pages!')
    return
  }

  console.log('Building CMS pages.')
  const pages = result.data.cms.page
  for(let page of pages) {
    if (!page) {
      return
    }
    
    let pageContext = {}
    const setPageContext = context => pageContext = { ...pageContext, ...context }
    const widgets = []
    const addWidget = widget => widgets.push(widget)
    await apiRunnerNode(`onCreatingTemplate`, {
      page,
      result,
      addWidget,
      graphql,
      setPageContext
    })

    const pagePath = page.path
    console.log(`Creating page template ${page.displayText} for ${pagePath}`)
    
    // Build a unique page template based on the widgets in the current page.
    let pageTemplate = ''
    const setPageTemplate = template => pageTemplate += template
    await apiRunnerNode(`createPageTemplate`, {
      page,
      widgets,
      setPageTemplate
    })

    if(!pageTemplate || pageTemplate.length <= 0) {
      console.log(`Couldn't create page template for ${pagePath}`)
      return
    }

    const pageName = pagePath.replace(/[^a-z0-9]+/gi, '')
    const templatePath = savePageTemplate(pageName, pageTemplate, store)

    const setPage = p => page = p
    await apiRunnerNode(`onCreatingPage`, { result, page, setPage })

    createPage({
      component: templatePath,
      context: {
        contentItemId: page.contentItemId,
        page: { ...page, ...pageContext }
      },
      path: pagePath,
    })
  }
}

function savePageTemplate(name, pageTemplate, store) {
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

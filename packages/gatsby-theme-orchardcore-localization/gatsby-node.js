const webpack = require("webpack")
const _ = require("lodash")
const createGraphqlRunner = require(`gatsby/dist/bootstrap/graphql-runner`)

function flattenMessages(nestedMessages, prefix = "") {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    let value = nestedMessages[key]
    let prefixedKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === "string") {
      messages[prefixedKey] = value
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey))
    }

    return messages
  }, {})
}

exports.onCreateWebpackConfig = ({ actions, plugins }, pluginOptions) => {
  const { redirectComponent = null, languages, defaultLanguage } = pluginOptions
  if (!languages.includes(defaultLanguage)) {
    languages.push(defaultLanguage)
  }
  const regex = new RegExp(languages.map(l => l.split("-")[0]).join("|"))
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        GATSBY_INTL_REDIRECT_COMPONENT_PATH: JSON.stringify(redirectComponent),
      }),
      new webpack.ContextReplacementPlugin(
        /react-intl[/\\]locale-data$/,
        regex
      ),
    ],
  })
}

let siteCultures = null

exports.onCreatePage = async ({ page, actions, store, report }, pluginOptions) => {
  //Exit if the page has already been processed.
  if (typeof page.context.intl === "object") {
    return
  }
  const { createPage, deletePage } = actions
  let {
    path = ".",
    languages = ["en"],
    defaultLanguage = "en",
    redirect = false,
  } = pluginOptions

  const graphql = createGraphqlRunner(store, report)

  const getCultures = async () => {
    let result = null
    try {
      result = await graphql(`
        query SiteCultures {
          cms {
            siteCultures {
              culture
              default
            }
          }
        }
      `)
    } catch (err) {
      console.warn(`Error getting site cultures: ${err}`)
      return null
    }

    if (result.errors) {
      console.log(result.errors)
      return null
    }

    return Object.values(result.data.cms.siteCultures)
  }

  const getMessages = (path, language) => {
    try {

      const messages = require(`${path}/${language}.json`)

      return flattenMessages(messages)
    } catch (err) {
      return {}
    }
  }

  const generatePage = (routed, language) => {
    const messages = getMessages(path, language)
    const newPath = routed ? `/${language}${page.path}` : page.path

    return {
      ...page,
      path: newPath,
      context: {
        ...page.context,
        intl: {
          language,
          languages,
          messages,
          routed,
          originalPath: page.path,
          redirect
        },
      },
    }
  }

  // Return cached site cultures, otherwise this 
  // query will be executed for every page.

  if(!siteCultures) {
    siteCultures = await getCultures()
  }

  if(siteCultures) {
    const cultures = siteCultures.map(c => c.culture)
    languages = _.union(languages, cultures)
    const defaultCulture = siteCultures.find(c => c.default)
    if(defaultCulture) {
      defaultLanguage = defaultCulture.culture
    }
  }

  const newPage = generatePage(false, defaultLanguage)
  deletePage(page)
  createPage(newPage)

  languages.forEach(language => {
    const localePage = generatePage(true, language)
    if (localePage.path.includes(`/404/`)) {
      localePage.matchPath = `/${language}/*`
    }
    createPage(localePage)
  })
}

const apiList = require(`gatsby/dist/utils/api-node-docs`)

module.exports = _ => {

  // Tell gatsby to allow these non-standard API calls
  apiList.sourcePageQuery = true
  apiList.onCreatingTemplate = true
  apiList.createPageTemplate = true
  apiList.onCreatingPage = true

  return ({
    __experimentalThemes: [
      {
        resolve: 'gatsby-source-orchardcore',
        options: {
          host: 'http://localhost:5000',
          // Url to query from
          url: 'http://localhost:5000/api/graphql',
          // access token to authenticate with the CMS
          accessToken: "12345"
        },
      }
    ],
  })
}

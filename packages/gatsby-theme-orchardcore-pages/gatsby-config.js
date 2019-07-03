const apiList = require(`gatsby/dist/utils/api-node-docs`)

module.exports = _ => {

  // Tell gatsby to allow these non-standard API calls
  apiList.sourcePageQuery = true
  apiList.onCreatingTemplate = true
  apiList.createPageTemplate = true
  apiList.onCreatingPage = true

  return ({
    plugins: [
      {
        resolve: 'gatsby-source-graphql',
        options: {
          // This type will contain remote schema Query type
          typeName: 'CMS',
          // This is the field under which it's accessible
          fieldName: 'cms',
          // Url to query from
          url: 'http://localhost:5000/api/graphql',
          // Refetch interval in seconds
          refetchInterval: 120,
        },
      },
    ],
    __experimentalThemes: [
      "gatsby-theme-orchardcore-flows"
    ],
  })
}

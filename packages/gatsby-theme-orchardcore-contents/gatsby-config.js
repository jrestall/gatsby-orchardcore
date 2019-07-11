module.exports = {
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
}

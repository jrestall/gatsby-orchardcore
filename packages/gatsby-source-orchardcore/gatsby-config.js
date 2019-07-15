module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
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
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp'
  ],
}

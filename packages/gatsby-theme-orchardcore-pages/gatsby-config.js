module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-graphql',
      options: {
        // This type will contain remote schema Query type
        typeName: 'CMS',
        // This is field under which it's accessible
        fieldName: 'cms',
        // Url to query from
        url: 'http://localhost:5000/api/graphql',
      },
    },
  ],
}

module.exports = {
  plugins: [
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
}

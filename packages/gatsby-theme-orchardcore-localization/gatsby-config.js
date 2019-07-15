module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-intl`,
      options: {
        // language JSON resource path
        path: `${__dirname}/src/intl`,
        // supported languages
        languages: ['en', 'es'],
        // default language file path
        defaultLanguage: 'en',
        // option to redirect to `/en` when connecting to `/`
        redirect: false,
      },
    },
  ]
}
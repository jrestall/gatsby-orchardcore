module.exports = {
  plugins: [
    "gatsby-plugin-typescript",
    "gatsby-plugin-tslint",
    "gatsby-theme-orchardcore-layers", 
    "gatsby-theme-orchardcore-media",
    "gatsby-theme-orchardcore-pages",
    {
      resolve: "gatsby-theme-orchardcore-localization",
        options: {
          // language JSON resource path
          path: `${__dirname}/src/intl`,
          // supported languages
          languages: [`en`, `es`],
          // default language file path
          defaultLanguage: `en`,
          // option to redirect to `/en` when connecting to `/`
          redirect: false,
        },
    } 
  ]
};

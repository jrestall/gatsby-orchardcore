module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-material-ui',
      // We use styled-components so need to change the injection order.
      options: {
        stylesProvider: {
          injectFirst: true
        }
      }
    },
    'gatsby-plugin-styled-components'
  ],
}

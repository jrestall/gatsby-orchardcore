import { graphql, useStaticQuery } from "gatsby"

export const useSiteMetadata = () => {
  const { cms } = useStaticQuery(
    graphql`
      query SiteMetaData {
        cms {
          site {
            name
            baseUrl
            image {
              urls
            }
          }
          siteCultures {
            locale
            default
          }
        }
      }
    `
  )
  return cms.site
}
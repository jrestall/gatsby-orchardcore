import { graphql, useStaticQuery } from "gatsby"

const useSiteLayers = () => {
  const { cms } = useStaticQuery(
    graphql`
      query SiteLayers {
        cms {
          siteLayers {
            name
            rule
            description
            widgets(status: PUBLISHED) {
              renderTitle
              position
              zone
              widget {
                ...Widgets
              }
            }
          }
        }
      }
    `
  )
  return Object.values(cms.siteLayers)
}

export default useSiteLayers
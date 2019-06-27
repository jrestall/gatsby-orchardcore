import React from "react"
import Helmet from "react-helmet"
import { useSiteMetadata } from "../hooks/useSiteMetadata";

export default ({page}) => {
    const { name, baseUrl, image, cultures } = useSiteMetadata()
    const imageUrl = image ? image.urls[0] : '' 
    const metaTitle = `${page.displayText} | ${name}`
    const defaultCulture = cultures.filter(culture => culture.default)
    return (
      <Helmet encodeSpecialCharacters={true} defaultTitle={name}>

        {/* <!-- Primary Meta Tags --> */}
        <html lang={page.localization ? page.localization.culture : defaultCulture} />
        <title>{metaTitle}</title>
        <meta name="title" content={metaTitle} />
        <meta name="description" content={page.description} />

        {/* <!-- Localization Meta Tags --> */}
        {cultures.map((culture) => 
          <link rel="alternate" href={`${baseUrl}${page.path}`} hrefLang={culture.locale} key={culture.locale} />
        )}

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="page" />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={page.description} />
        <meta property="og:image" content={image} />
        
        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={baseUrl} />
        <meta property="twitter:title" content={metaTitle} />
        <meta property="twitter:description" content={page.description} />
        <meta property="twitter:image" content={image}/>

      </Helmet>
    )
}
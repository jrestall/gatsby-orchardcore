import { ContentBuilder } from "gatsby-theme-orchardcore-contents";

export default class MediaBuilder extends ContentBuilder {
  public buildQuery(operations) {
    // Query all CMS images within the page query so that we can match any
    // images used within the page with those stored locally on disk.
    operations.push(`
      allImageSharp {
        edges {
          node {
            id
            fluid(maxWidth: 4160, quality: 100) {
              originalName
              base64
              aspectRatio
              src
              srcSet
              sizes
            }
          }
        }
      }`)
  }

  public createPage(contentItem, _template, data) {
    if(!data.allImageSharp) {
      console.warn(`gatsby-theme-orchardcore-media couldn't retrieve the local images!`)
      return
    }

    const images = data.allImageSharp.edges
    if(!images) {
      console.log(`gatsby-theme-orchardcore-media: No images stored in CMS.`)
      return
    }

    // Search the page object for any image urls and add the gatsby-image 
    // object as an additional property on the image. The image can then be 
    // used with gatsby-image.
    this.appendGatsbyImages(images, contentItem)
  }

  private appendGatsbyImages(images, page) {
    // All images in OrchardCore have the following format so we can search
    // for a urls property to find the image objects.
    //  imageName {
    //    urls
    //  }
    const pageImages = this.findImages(page, 'urls')
    this.appendImages(images, pageImages)
  }

  private appendImages(images, pageImages) {
    for(const image of pageImages) {
      // Ensure urls property is an array
      const imageUrls = image.urls
      if(!Array.isArray(imageUrls)) {
        console.log('Image urls property was not an array.')
        continue
      }

      // Ensure there is a url specified
      if(imageUrls.length <= 0) {
        console.log('No urls exist on image object.')
        continue
      }

      const imageUrl = image.urls[0]
      const imageName = this.getImageNameFromUrl(imageUrl)

      // Find page image in all stored images
      const foundImage = images.find(img => {
        return (img.node.fluid.originalName === `${imageName}`)
      })

      // Add fluid property to image object
      if (foundImage) {
        image.fluid = foundImage.node.fluid
        console.log(`${imageName} found.`)
      }else{
        console.log(`${imageName} not found.`)
      }
    }
  }

  private findImages(object, propName) {
    let images = []
    // tslint:disable-next-line: forin
    for (const key in object) {
      if (key === propName) {
        images.push(object);
        break
      }

      if (object[key] && typeof object[key] === 'object') {
        const nestedImages = this.findImages(object[key], propName);
        if(nestedImages && nestedImages.length >= 1) {
          images = [...nestedImages, ...images]
        }
      }
    }
    return images
  }

  private getImageNameFromUrl(url) {
    return url.split('\\').pop().split('/').pop()
  }
}
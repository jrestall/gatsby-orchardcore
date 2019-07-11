import { ContentBuilder } from "gatsby-theme-orchardcore-contents";

export default class PageBuilder extends ContentBuilder {
  public buildQuery(operations) {
    operations.push(`
      cms { 
        contents: page(status: PUBLISHED) {
          ...Page
        }
      }`
    )
  }
}
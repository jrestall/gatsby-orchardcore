import { IContentBuilder } from "./types";

export default abstract class ContentBuilder implements IContentBuilder {
  buildQuery(_operations, _fragments) {/*Empty default implementation*/}
  buildWidgets(_contentItem, _widgetDefinitions) {/*Empty default implementation*/}
  setActiveWidgets(_contentItem, _activeWidgets, _widgetDefinitions, _data) {/*Empty default implementation*/}
  createPage(_content, _template, _data) {/*Empty default implementation*/}
}
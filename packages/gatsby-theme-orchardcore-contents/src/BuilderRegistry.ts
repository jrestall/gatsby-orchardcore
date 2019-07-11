import { IContentBuilder } from './types'
import WidgetBuilder from './WidgetBuilder';

const contentBuilders: object[] = [WidgetBuilder]

export default function registerBuilder(builder: IContentBuilder) {
  contentBuilders.push(builder)
}

export function getBuilders() {
  return contentBuilders
}
import { AppResource } from './app-resource.model';

export type contentRange = [AppResource, number, number, number];

export interface GetListResult<T> {
  data: Array<T>;
  contentRange: contentRange;
}

import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

// Models
import { GetListQuery } from '../models/get-list-query.model';

@Injectable()
export class ParseListQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): { query: GetListQuery; listType: 'getMany' | 'getList' } {
    const defaultQuery: GetListQuery = {
      filter: undefined,
      range: undefined,
      sort: undefined
    };
    let listType = undefined;

    if (value.filter instanceof Object) {
      defaultQuery.filter = value.filter;
    }

    if (value.range instanceof Array && value.range.length === 2) {
      defaultQuery.range = value.range;
    }

    if (value.sort instanceof Array && value.range.length === 2) {
      defaultQuery.sort = value.sort;
    }

    if (defaultQuery.filter && defaultQuery.filter.hasOwnProperty('id') && value.filter.id instanceof Array) {
      listType = 'getMany';
    }

    if (defaultQuery.filter && defaultQuery.range && defaultQuery.sort) {
      listType = 'getList';
    }

    console.log({ defaultQuery, listType, value });
    // console.log(metadata);

    return { query: defaultQuery, listType };
  }
}

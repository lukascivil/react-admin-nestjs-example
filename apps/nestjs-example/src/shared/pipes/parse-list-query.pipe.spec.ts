// Packages
import { ParseListQueryPipe } from './parse-list-query.pipe';

// Models
import { GetListQuery } from '../models/get-list-query.model';

describe('ListQueryPipe', () => {
  const validListQuery: GetListQuery = {
    filter: {},
    range: [0, 9],
    sort: ['id', 'ASC']
  };
  const invalidListQuery: any = {
    filter: {},
    range: [9],
    sort: []
  };

  it('should be defined', () => {
    expect(new ParseListQueryPipe()).toBeDefined();
  });

  it('should return valid ListQuery with a valid query', () => {
    const parseQueryListPipe = new ParseListQueryPipe();
    const transformedQueryList = parseQueryListPipe.transform(validListQuery, undefined);

    expect(transformedQueryList.query.filter instanceof Object).toBeTruthy();
    expect(transformedQueryList.query.range.length).toEqual(2);
    expect(transformedQueryList.query.sort.length).toEqual(2);
  });

  it('should return valid ListQuery with a invalid query', () => {
    const parseQueryListPipe = new ParseListQueryPipe();
    const transformedQueryList = parseQueryListPipe.transform(invalidListQuery, undefined);

    expect(transformedQueryList.query.filter instanceof Object).toBeTruthy();
    expect(transformedQueryList.query.range.length).toEqual(2);
    expect(transformedQueryList.query.sort.length).toEqual(2);
  });
});

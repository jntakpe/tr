import { PageRequest } from './page-request';
import { SortDirection } from 'angular2-data-table';

describe('page request', () => {

  it('should create default page request', () => {
    const urlSearchParams = new PageRequest({}).toUrlSearchParams();
    expect(urlSearchParams.paramsMap.size).toBe(2);
    expect(urlSearchParams.get('page')).toBe('0');
    expect(urlSearchParams.get('size')).toBe('10');
  });

  it('should create custom page request', () => {
    const urlSearchParams = new PageRequest({limit: 20, offset: 1}).toUrlSearchParams();
    expect(urlSearchParams.paramsMap.size).toBe(2);
    expect(urlSearchParams.get('page')).toBe('1');
    expect(urlSearchParams.get('size')).toBe('20');
  });

  it('should create custom page request with sort', () => {
    const sorts = [{prop: 'someProp', dir: SortDirection.asc}];
    const urlSearchParams = new PageRequest({limit: 20, offset: 1, sorts}).toUrlSearchParams();
    expect(urlSearchParams.paramsMap.size).toBe(4);
    expect(urlSearchParams.get('page')).toBe('1');
    expect(urlSearchParams.get('size')).toBe('20');
    expect(urlSearchParams.get('direction')).toBe('asc');
    expect(urlSearchParams.get('column')).toBe('someProp');
  });

  it('should create default page request with filter params', () => {
    const urlSearchParams = new PageRequest({}, {name: 'Toto', address: {street: 'wall st'}}).toUrlSearchParams();
    expect(urlSearchParams.paramsMap.size).toBe(4);
    expect(urlSearchParams.get('page')).toBe('0');
    expect(urlSearchParams.get('size')).toBe('10');
    expect(urlSearchParams.get('name')).toBe('Toto');
    expect(urlSearchParams.get('address.street')).toBe('wall st');
  });

  it('should create default page request with filter params ignoring falsy params', () => {
    const urlSearchParams = new PageRequest({}, {name: 'Toto', age: null, address: {street: 'wall st'}})
      .toUrlSearchParams();
    expect(urlSearchParams.paramsMap.size).toBe(4);
    expect(urlSearchParams.get('page')).toBe('0');
    expect(urlSearchParams.get('size')).toBe('10');
    expect(urlSearchParams.get('name')).toBe('Toto');
    expect(urlSearchParams.get('address.street')).toBe('wall st');
  });

});

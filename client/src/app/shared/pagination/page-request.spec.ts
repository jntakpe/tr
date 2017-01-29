import { PageRequest } from './page-request';
import { PageContext } from './page-context';
import { PageEvent } from './page-event';
import { Sort } from './sort';

describe('page request', () => {

  it('should create default page request', () => {
    const urlSearchParams = new PageRequest(new PageContext()).toUrlSearchParams();
    expect(urlSearchParams.paramsMap.size).toBe(2);
    expect(urlSearchParams.get('page')).toBe('0');
    expect(urlSearchParams.get('size')).toBe('10');
  });

  it('should create custom page request', () => {
    const urlSearchParams = new PageRequest(new PageContext(new PageEvent(20, 1))).toUrlSearchParams();
    expect(urlSearchParams.paramsMap.size).toBe(2);
    expect(urlSearchParams.get('page')).toBe('1');
    expect(urlSearchParams.get('size')).toBe('20');
  });

  it('should create custom page request with sort', () => {
    const urlSearchParams = new PageRequest(new PageContext(new PageEvent(20, 1), new Sort('someProp', 'asc'))).toUrlSearchParams();
    expect(urlSearchParams.paramsMap.size).toBe(4);
    expect(urlSearchParams.get('page')).toBe('1');
    expect(urlSearchParams.get('size')).toBe('20');
    expect(urlSearchParams.get('direction')).toBe('asc');
    expect(urlSearchParams.get('column')).toBe('someProp');
  });

  it('should create default page request with filter params', () => {
    const urlSearchParams = new PageRequest(new PageContext(), {name: 'Toto', address: {street: 'wall st'}}).toUrlSearchParams();
    expect(urlSearchParams.paramsMap.size).toBe(4);
    expect(urlSearchParams.get('page')).toBe('0');
    expect(urlSearchParams.get('size')).toBe('10');
    expect(urlSearchParams.get('name')).toBe('Toto');
    expect(urlSearchParams.get('address.street')).toBe('wall st');
  });

  it('should create default page request with filter params ignoring falsy params', () => {
    const urlSearchParams = new PageRequest(new PageContext(), {name: 'Toto', age: null, address: {street: 'wall st'}})
      .toUrlSearchParams();
    expect(urlSearchParams.paramsMap.size).toBe(4);
    expect(urlSearchParams.get('page')).toBe('0');
    expect(urlSearchParams.get('size')).toBe('10');
    expect(urlSearchParams.get('name')).toBe('Toto');
    expect(urlSearchParams.get('address.street')).toBe('wall st');
  });

});

import {Injectable} from '@angular/core';
import {RegexType} from './regex-type';
import * as sift from 'sift';

@Injectable()
export class FilterTableService {

  constructor() {
  }

  regexFilter<T>(data: T[], filterParams: {[key: string]: any}, regexType: RegexType = RegexType.StartsWith, operator = '$and') {
    const truthyParams = this.getTruthyParams(filterParams);
    if (!truthyParams) {
      return data;
    }
    const predicates = this.buildPredicatesArray(truthyParams, regexType);
    return sift({[operator]: predicates}, data);
  }

  private buildPredicatesArray(filterParams: {[key: string]: any}, regexType: RegexType): any[] {
    const predicates = [];
    for (const key of Object.keys(filterParams)) {
      predicates.push(this.regexPredicate(key, filterParams[key], regexType));
    }
    return predicates;
  }

  private regexPredicate(key, value, regexType: RegexType): any {
    const regex = this.regexByType(value, regexType);
    return {[key]: {$regex: regex, $options: 'i'}};
  }

  private regexByType(value: any, regexType: RegexType): string {
    switch (regexType) {
      case RegexType.Contains:
        return `${value}`;
      case RegexType.EndsWith:
        return `${value}$`;
      default:
        return `^${value}`;
    }
  }

  private getTruthyParams(filterParams: {[key: string]: any}): {[key: string]: any} {
    if (!filterParams) {
      return;
    }
    const truthyParams: {[key: string]: any} = {};
    let isTruthy = false;
    for (const key of Object.keys(filterParams)) {
      const value = filterParams[key];
      if (value) {
        truthyParams[key] = value;
        isTruthy = true;
      }
    }
    return isTruthy ? truthyParams : null;
  }

}

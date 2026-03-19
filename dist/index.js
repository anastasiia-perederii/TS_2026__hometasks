"use strict";
var ListFilterTypeEnum;
(function (ListFilterTypeEnum) {
    ListFilterTypeEnum["MATCH"] = "MATCH";
    ListFilterTypeEnum["RANGE"] = "RANGE";
    ListFilterTypeEnum["SET"] = "SET";
})(ListFilterTypeEnum || (ListFilterTypeEnum = {}));
class BaseList {
    constructor(items, filtersState) {
        this._items = items;
        this._filtersState = filtersState;
    }
    applySearchValue(val) {
        this._filtersState = {
            ...this._filtersState,
            name: {
                type: ListFilterTypeEnum.MATCH,
                filter: val,
            },
        };
    }
}
class FilmList extends BaseList {
    applyFiltersValue(filters) {
        this._filtersState = {
            ...this._filtersState,
            ...filters,
        };
    }
}
class CategoryList extends BaseList {
}
function curry(fn) {
    const curried = (...args) => {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        return (...nextArgs) => curried(...args, ...nextArgs);
    };
    return curried;
}
function buildUrl(protocol, domain, path, port, q) {
    return `${protocol}://${domain}/${path}:${port}${q ? '?q=true' : ''}`;
}
const curriedBuilder = curry(buildUrl);
const withHttps = curriedBuilder('https', 'example.com');
const withDomain = withHttps('api/users');
const final = withDomain(4200);
const superFinal = final(true);
console.log(superFinal);

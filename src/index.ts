enum ListFilterTypeEnum {
    MATCH = 'MATCH',
    RANGE = 'RANGE',
    SET = 'SET',
}

type MatchFilter<T> = {
    type: ListFilterTypeEnum.MATCH;
    filter: T;
};

type RangeFilter<T extends number> = {
    type: ListFilterTypeEnum.RANGE;
    filter: T;
    filterTo: T;
};

type SetFilter<T extends string> = {
    type: ListFilterTypeEnum.SET;
    values: T[];
};

interface Film {
    readonly id: number;
    name: string;
    year: number;
    awards: ReadonlyArray<string>;
    rating: number;
}

interface Category {
    readonly id: number;
    name: string;
    films: ReadonlyArray<Film>;
}

interface BaseFiltersState {
    name: MatchFilter<string>;
}

interface CategoryFiltersState extends BaseFiltersState {}

interface FilmFiltersState extends BaseFiltersState {
    year?: MatchFilter<number> | RangeFilter<number>;
    rating?: RangeFilter<number>;
    awards?: SetFilter<string>;
}

abstract class BaseList<T, U extends BaseFiltersState> {
    protected _items: ReadonlyArray<T>;
    protected _filtersState: U;

    constructor(items: ReadonlyArray<T>, filtersState: U) {
        this._items = items;
        this._filtersState = filtersState;
    }

    public applySearchValue(val: string): void {
        this._filtersState = {
            ...this._filtersState,
            name: {
                type: ListFilterTypeEnum.MATCH,
                filter: val,
            },
        };
    }
}

class FilmList extends BaseList<Film, FilmFiltersState> {
    public applyFiltersValue(
        filters: Partial<Omit<FilmFiltersState, 'name'>>,
    ): void {
        this._filtersState = {
            ...this._filtersState,
            ...filters,
        };
    }
}

class CategoryList extends BaseList<Category, CategoryFiltersState> {}

type PartialTuple<T extends unknown[]> = T extends [infer F, ...infer R]
    ? [F] | [F, ...PartialTuple<R>]
    : never;

type TupleOfUnknown<T> = T extends [unknown, ...infer R]
    ? [unknown, ...TupleOfUnknown<R>]
    : [];

type Curry<Args extends unknown[], Return> = Args extends []
    ? () => Return
    : <T extends PartialTuple<Args>>(...args: T) => Args extends [...TupleOfUnknown<T>, ...infer Rest]
        ? Rest extends []
            ? Return
            : Curry<Rest, Return>
        : never;

function curry<A extends unknown[], R>(fn: (...args: A) => R): Curry<A, R> {
    const curried = (...args: unknown[]): unknown => {
        if (args.length >= fn.length) {
            return fn(...(args as A));
        }

        return (...nextArgs: unknown[]) => curried(...args, ...nextArgs);
    };

    return curried as Curry<A, R>;
}

function buildUrl(
    protocol: string,
    domain: string,
    path: string,
    port: number,
    q: boolean,
): string {
    return `${protocol}://${domain}/${path}:${port}${q ? '?q=true' : ''}`;
}

const curriedBuilder = curry(buildUrl);

const withHttps = curriedBuilder('https', 'example.com');
const withDomain = withHttps('api/users');
const final = withDomain(4200);
const superFinal = final(true);

console.log(superFinal);
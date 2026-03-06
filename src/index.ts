//  Filter types

enum GridFilterTypeEnum {
    MATCH = "match",
    RANGE = "range",
}

type GridFilterValue<T> = {
    type: GridFilterTypeEnum;
    filter: Extract<T, string | number>;
    filterTo?: Extract<T, string | number>;
};

type GridFilterSetValues<T> = {
    values: T[];
};

//  Entities

interface Film {
    title: string;
    year: number;
    rating: number;
    awards: string[];
}

interface Category {
    name: string;
    films: Film[];
}

//  Filter states

interface FilmFilters {
    search?: GridFilterValue<string>;
    year?: GridFilterValue<number>;
    rating?: GridFilterValue<number>;
    awards?: GridFilterSetValues<string>;
}

interface CategoryFilters {
    search?: GridFilterValue<string>;
}

//  Base grid list interface

interface GridList<TItem, TFilters> {
    items: TItem[];
    filters: TFilters;

    applySearchValue(value: string): void;
}

//  Film list interface

interface FilmList extends GridList<Film, FilmFilters> {
    applyFiltersValue(filters: Partial<FilmFilters>): void;
}

//  Category list interface

interface CategoryList extends GridList<Category, CategoryFilters> {}

//  Film list implementation

class FilmListImpl implements FilmList {
    items: Film[] = [];
    filters: FilmFilters = {};

    applySearchValue(value: string): void {
        this.filters.search = {
            type: GridFilterTypeEnum.MATCH,
            filter: value,
        };
    }

    applyFiltersValue(filters: Partial<FilmFilters>): void {
        this.filters = {
            ...this.filters,
            ...filters,
        };
    }
}

//  Category list implementation

class CategoryListImpl implements CategoryList {
    items: Category[] = [];
    filters: CategoryFilters = {};

    applySearchValue(value: string): void {
        this.filters.search = {
            type: GridFilterTypeEnum.MATCH,
            filter: value,
        };
    }
}
type DeepReadonly<T> =
    T extends (...args: unknown[]) => unknown
        ? T
        : T extends readonly unknown[]
            ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
            : T extends object
                ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
                : T;

type DeepRequireReadonly<T> =
    T extends (...args: unknown[]) => unknown
        ? T
        : T extends readonly unknown[]
            ? { readonly [K in keyof T]-?: DeepRequireReadonly<T[K]> }
            : T extends object
                ? { readonly [K in keyof T]-?: DeepRequireReadonly<T[K]> }
                : T;

type UpperCaseKeys<T> = {
    [K in keyof T as K extends string ? Uppercase<K> : K]: T[K];
};

type ObjectToPropertyDescriptor<T> = {
    [K in keyof T]: TypedPropertyDescriptor<T[K]>;
};

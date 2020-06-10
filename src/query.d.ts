export interface Query extends QueryDataArrayAny, QueryDataString, QueryDataNumber, QueryDataBoolean {
}
export interface QueryDataArrayAny {
    and?: any[];
    or?: any[];
    distinct?: any[];
    distinctRaw?: any[];
    select?: any[];
    selectRaw?: any[];
    group?: any[];
    groupRaw?: any[];
    having?: any[];
    window?: any[];
    union?: any[];
    unionAll?: any[];
    intersect?: any[];
    intersectAll?: any[];
    except?: any[];
    exceptAll?: any[];
    order?: any[];
    orderRaw?: any[];
    join?: any[];
    prepareArguments?: any[];
}
export interface QueryDataString {
    from?: string;
    as?: string;
    for?: string;
}
export interface QueryDataNumber {
    limit?: number;
    offset?: number;
}
export interface QueryDataBoolean {
    take?: boolean;
    exists?: boolean;
}
export declare const createQuery: <T extends object>(model: T, prev?: any) => T & {
    model: T;
    __query: Query;
};
export declare const merge: <T extends {
    __query?: Query | undefined;
}>(model: T, args: {
    __query: any;
}[]) => T & {
    model: T;
    __query: Query;
};
export declare const toQuery: <T extends object>(model: T) => T & {
    model: T;
    __query: Query;
};
export declare const setNumber: <T extends {
    __query: Query;
}>(model: {
    toQuery: () => T;
}, key: keyof QueryDataNumber, value: number) => T;
export declare const setString: <T extends {
    __query: Query;
}>(model: {
    toQuery: () => T;
}, key: keyof QueryDataString, value: string) => T;
export declare const setBoolean: <T extends {
    __query: Query;
}>(model: {
    toQuery: () => T;
}, key: keyof QueryDataBoolean, value: boolean) => T;
export declare const pushArrayAny: <T extends {
    __query: Query;
}>(model: {
    toQuery: () => T;
}, key: keyof QueryDataArrayAny, args: any[]) => T;

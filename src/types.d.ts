import { Adapter } from 'pg-adapter';
import { PgError } from 'pg-adapter';
export declare type MQ = Model | Query;
export interface Base {
    setDefaultScope(this: MQ, scope: (query: Query) => Query): void;
    unscoped(this: MQ): Query;
    all(this: MQ): Query;
    _all(this: MQ): Query;
    toQuery(this: MQ): Query;
    clone(this: MQ): Query;
    toSql(this: MQ): string;
    resultType(this: MQ, type: string): Query;
    _resultType(this: MQ, type: string): Query;
    query(this: MQ): Query;
    _query(this: MQ): Query;
    objects(this: MQ): Query;
    _objects(this: MQ): Query;
    arrays(this: MQ): Query;
    _arrays(this: MQ): Query;
    value(this: MQ): Query;
    _value(this: MQ): Query;
    exec(this: MQ): Query;
    _exec(this: MQ): Query;
    then(this: MQ, resolve: (result: any) => any, reject: (error: PgError) => any): Promise<any>;
    take(this: MQ): Query;
    _take(this: MQ): Query;
    and(this: MQ, ...args: any[]): Query;
    _and(this: MQ, ...args: any[]): Query;
    or(this: MQ, ...args: any[]): Query;
    _or(this: MQ, ...args: any[]): Query;
    where(this: MQ, ...args: any[]): Query;
    _where(this: MQ, ...args: any[]): Query;
    find(this: MQ, id: any): Query;
    _find(this: MQ, id: any): Query;
    findBy(this: MQ, ...args: any[]): Query;
    _findBy(this: MQ, ...args: any[]): Query;
    distinct(this: MQ, ...args: any[]): Query;
    _distinct(this: MQ, ...args: any[]): Query;
    distinctRaw(this: MQ, ...args: any[]): Query;
    _distinctRaw(this: MQ, ...args: any[]): Query;
    select(this: MQ, ...args: any[]): Query;
    _select(this: MQ, ...args: any[]): Query;
    selectRaw(this: MQ, ...args: any[]): Query;
    _selectRaw(this: MQ, ...args: any[]): Query;
    from(this: MQ, source: string): Query;
    _from(this: MQ, source: string): Query;
    as(this: MQ, as: string): Query;
    _as(this: MQ, as: string): Query;
    wrap(this: MQ, query: MQ, as?: string): Query;
    _wrap(this: MQ, query: MQ, as?: string): Query;
    json(this: MQ): Query;
    _json(this: MQ): Query;
    group(this: MQ, ...args: any[]): Query;
    _group(this: MQ, ...args: any[]): Query;
    groupRaw(this: MQ, ...args: any[]): Query;
    _groupRaw(this: MQ, ...args: any[]): Query;
    having(this: MQ, ...args: any[]): Query;
    _having(this: MQ, ...args: any[]): Query;
    window(this: MQ, ...args: any[]): Query;
    _window(this: MQ, ...args: any[]): Query;
    union(this: MQ, ...args: any[]): Query;
    _union(this: MQ, ...args: any[]): Query;
    unionAll(this: MQ, ...args: any[]): Query;
    _unionAll(this: MQ, ...args: any[]): Query;
    intersect(this: MQ, ...args: any[]): Query;
    _intersect(this: MQ, ...args: any[]): Query;
    intersectAll(this: MQ, ...args: any[]): Query;
    _intersectAll(this: MQ, ...args: any[]): Query;
    except(this: MQ, ...args: any[]): Query;
    _except(this: MQ, ...args: any[]): Query;
    exceptAll(this: MQ, ...args: any[]): Query;
    _exceptAll(this: MQ, ...args: any[]): Query;
    order(this: MQ, ...args: any[]): Query;
    _order(this: MQ, ...args: any[]): Query;
    orderRaw(this: MQ, ...args: any[]): Query;
    _orderRaw(this: MQ, ...args: any[]): Query;
    limit(this: MQ, value: number): Query;
    _limit(this: MQ, value: number): Query;
    offset(this: MQ, value: number): Query;
    _offset(this: MQ, value: number): Query;
    for(this: MQ, value: string): Query;
    _for(this: MQ, value: string): Query;
    join(this: MQ, ...args: any[]): Query;
    _join(this: MQ, ...args: any[]): Query;
    exists(this: MQ, ...args: any[]): Query;
    _exists(this: MQ, ...args: any[]): Query;
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
export interface QueryDataOther {
    take?: boolean;
    type?: string;
}
export declare type QueryData = QueryDataArrayAny & QueryDataString & QueryDataNumber & QueryDataBoolean & QueryDataOther;
export interface Prototype extends Base {
    model: undefined;
    __query: undefined;
}
export interface Model extends Prototype {
    db: Adapter;
    table: string;
    quotedTable: string;
    primaryKey: string;
}
export interface Query extends Base {
    db: Adapter;
    model: Model;
    primaryKey: string;
    __query: QueryData;
}
export interface RelationQuery {
    (record: any): Query;
    __subquery?: SubQuery;
    associationTake?: boolean;
    sourceModel?: Model;
}
export interface SubQuery {
    (): Query;
}
export interface Scope {
    (query: Query): Query;
}
export interface QueryFunction {
    (...args: any[]): Query;
}
export interface Queries {
    [key: string]: QueryFunction;
}
export interface QueriesFunction {
    (db: Adapter): Queries;
}
export interface Prepared {
    [key: string]: Query | {
        args?: string[];
        query: Query;
    };
}
export interface PreparedFunction {
    (db: Adapter): Prepared;
}
export interface BelongsTo {
    belongsTo: () => Model;
    scope?: (query: any) => any;
    primaryKey?: string;
    foreignKey?: string;
}
export interface HasOne {
    hasOne: () => Model;
    scope?: (query: any) => any;
    primaryKey?: string;
    foreignKey?: string;
}
export interface HasMany {
    hasMany: () => Model;
    scope?: (query: any) => any;
    primaryKey?: string;
    foreignKey?: string;
}
export declare type Relation = BelongsTo | HasOne | HasMany;
export interface Definition {
    table?: string;
    primaryKey?: string;
    relations?: {
        [key: string]: Relation;
    };
    prepared?: PreparedFunction;
    queries?: QueryFunction;
    scopes?: {
        [key: string]: (query: any) => Query;
    };
}

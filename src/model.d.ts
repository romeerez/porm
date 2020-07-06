import { Adapter, Prepared } from "pg-adapter";
import { Query } from "./query";
import { BelongsToOptions, HasOptions, HasAndBelongsToManyOptions } from './relations';
import { aggregateSql, AggregateOptions } from './aggregate';
import { ColumnDefinition } from "./extraTypes";
export declare type ModelQuery<Model> = Model & {
    __query: Query;
};
export declare type Then<T> = (this: Model<T>, resolve?: (value: T) => any, reject?: (error: any) => any) => Promise<T | never>;
export declare type Scope<T, P> = {
    (params: P): T;
    subquery: () => T;
    json: () => T;
    many: boolean;
    sourceModel: Model<any>;
};
export declare type ScopeOne<T extends Model<T>, P> = Scope<ReturnType<T['take']>, P>;
export declare type ScopeAll<T extends Model<T>, P> = Scope<ReturnType<T['all']>, P>;
export declare type IdParameter<Entity> = number | string | Partial<Entity> | (number | string | Partial<Entity>)[];
export interface Model<Entity> {
    model: this;
    __query?: Query;
    config: Config;
    db: Adapter;
    table: string;
    quotedTable: string;
    primaryKey: string;
    quotedPrimaryKey: string;
    hiddenColumns: string[];
    createdAtColumnName: string;
    updatedAtColumnName: string;
    deletedAtColumnName: string;
    aggregateSql: typeof aggregateSql;
    columns(): Promise<Record<string, ColumnDefinition>>;
    columnNames(): Promise<string[]>;
    create<T extends Partial<Entity>>(records: T, returning?: string | string[]): Entity;
    create<T extends Partial<Entity>>(records: T[], returning?: string | string[]): Entity[];
    updateAll<T>(set: string | Record<string, any>, returning?: string | string[]): Promise<T[]>;
    update<T>(id: IdParameter<Entity>, set: string | Record<string, any>, returning?: string | string[]): Promise<T[]>;
    deleteAll<T>(returning?: string | string[]): Promise<T[]>;
    delete<T>(id: IdParameter<Entity>, returning?: string | string[]): Promise<T[]>;
    setDefaultScope(scope: (model: Model<Entity>) => ModelQuery<this>): void;
    unscoped(): ModelQuery<this>;
    belongsTo<T extends Model<any>, P>(fn: (params: P) => T, options?: BelongsToOptions<T>): ScopeOne<T, P>;
    hasOne<T extends Model<any>, P>(fn: (params: P) => T, options?: HasOptions<T>): ScopeOne<T, P>;
    hasMany<T extends Model<any>, P>(fn: (params: P) => T, options?: HasOptions<T>): ScopeAll<T, P>;
    hasAndBelongsToMany<T extends Model<any>, P>(fn: (params: P) => T, options?: HasAndBelongsToManyOptions<T>): ScopeAll<T, P>;
    relations<T extends {
        [key: string]: any;
    }>(fn: (model: Model<Entity>) => T): this & T;
    scopes<T extends {
        [key: string]: (this: Model<Entity>, ...args: any[]) => Model<Entity>;
    }>(scopes: T): this & T;
    prepare<T extends Record<string, () => any>>(fn: (prepare: (args: string[], query: Model<any>) => Promise<Prepared>, model: Model<Entity>) => T): {
        [K in keyof T]: ReturnType<T[K]>;
    } & Model<Entity>;
    then: Then<Entity[]>;
    all(): Omit<this, 'then'> & {
        then: Then<Entity[]>;
    };
    _all(): Omit<this, 'then'> & {
        then: Then<Entity[]>;
    };
    take(): Omit<this, 'then'> & {
        then: Then<Entity>;
    };
    _take(): Omit<this, 'then'> & {
        then: Then<Entity>;
    };
    rows(): Omit<this, 'then'> & {
        then: Then<any[][]>;
    };
    _rows(): Omit<this, 'then'> & {
        then: Then<any[][]>;
    };
    value(): Omit<this, 'then'> & {
        then: Then<any>;
    };
    _value(): Omit<this, 'then'> & {
        then: Then<any>;
    };
    exec(): Omit<this, 'then'> & {
        then: Then<void>;
    };
    _exec(): Omit<this, 'then'> & {
        then: Then<void>;
    };
    toSql(): Promise<string>;
    toQuery(): ModelQuery<this>;
    clone(): ModelQuery<this>;
    merge(...args: ModelQuery<any>[]): ModelQuery<this>;
    _merge(...args: ModelQuery<any>[]): ModelQuery<this>;
    distinct(...args: any[]): ModelQuery<this>;
    _distinct(...args: any[]): ModelQuery<this>;
    distinctRaw(...args: any[]): ModelQuery<this>;
    _distinctRaw(...args: any[]): ModelQuery<this>;
    select(...args: any[]): ModelQuery<this>;
    _select(...args: any[]): ModelQuery<this>;
    selectRaw(...args: any[]): ModelQuery<this>;
    _selectRaw(...args: any[]): ModelQuery<this>;
    include(...args: any[]): ModelQuery<this>;
    _include(...args: any[]): ModelQuery<this>;
    from(source: string | Promise<string>): ModelQuery<this>;
    _from(source: string | Promise<string>): ModelQuery<this>;
    as(as: string): ModelQuery<this>;
    _as(as: string): ModelQuery<this>;
    wrap(query: Model<any>, as?: string): ModelQuery<this>;
    _wrap(query: Model<any>, as?: string): ModelQuery<this>;
    json(): ModelQuery<this>;
    _json(): ModelQuery<this>;
    join(...args: any[]): ModelQuery<this>;
    _join(...args: any[]): ModelQuery<this>;
    where(...args: any[]): ModelQuery<this>;
    _where(...args: any[]): ModelQuery<this>;
    and(...args: any[]): ModelQuery<this>;
    _and(...args: any[]): ModelQuery<this>;
    or(...args: any[]): ModelQuery<this>;
    _or(...args: any[]): ModelQuery<this>;
    find(id: any): ReturnType<this['take']>;
    _find(id: any): ReturnType<this['take']>;
    findBy(...args: any[]): ReturnType<this['take']>;
    _findBy(...args: any[]): ReturnType<this['take']>;
    order(...args: any[]): ModelQuery<this>;
    _order(...args: any[]): ModelQuery<this>;
    orderRaw(...args: any[]): ModelQuery<this>;
    _orderRaw(...args: any[]): ModelQuery<this>;
    group(...args: any[]): ModelQuery<this>;
    _group(...args: any[]): ModelQuery<this>;
    groupRaw(...args: any[]): ModelQuery<this>;
    _groupRaw(...args: any[]): ModelQuery<this>;
    having(...args: any[]): ModelQuery<this>;
    _having(...args: any[]): ModelQuery<this>;
    window(...args: any[]): ModelQuery<this>;
    _window(...args: any[]): ModelQuery<this>;
    union(...args: any[]): ModelQuery<this>;
    _union(...args: any[]): ModelQuery<this>;
    unionAll(...args: any[]): ModelQuery<this>;
    _unionAll(...args: any[]): ModelQuery<this>;
    intersect(...args: any[]): ModelQuery<this>;
    _intersect(...args: any[]): ModelQuery<this>;
    intersectAll(...args: any[]): ModelQuery<this>;
    _intersectAll(...args: any[]): ModelQuery<this>;
    except(...args: any[]): ModelQuery<this>;
    _except(...args: any[]): ModelQuery<this>;
    exceptAll(...args: any[]): ModelQuery<this>;
    _exceptAll(...args: any[]): ModelQuery<this>;
    limit(value: number): ModelQuery<this>;
    _limit(value: number): ModelQuery<this>;
    offset(value: number): ModelQuery<this>;
    _offset(value: number): ModelQuery<this>;
    for(value: string): ModelQuery<this>;
    _for(value: string): ModelQuery<this>;
    exists(): Omit<this, 'then'> & {
        then: Then<boolean>;
    };
    _exists(): Omit<this, 'then'> & {
        then: Then<boolean>;
    };
    count(args?: string, options?: AggregateOptions): Omit<this, 'then'> & {
        then: Then<boolean>;
    };
    _count(args?: string, options?: AggregateOptions): Omit<this, 'then'> & {
        then: Then<boolean>;
    };
    avg(args: string, options?: AggregateOptions): Omit<this, 'then'> & {
        then: Then<boolean>;
    };
    _avg(args: string, options?: AggregateOptions): Omit<this, 'then'> & {
        then: Then<boolean>;
    };
    min(args: string, options?: AggregateOptions): Omit<this, 'then'> & {
        then: Then<boolean>;
    };
    _min(args: string, options?: AggregateOptions): Omit<this, 'then'> & {
        then: Then<boolean>;
    };
    max(args: string, options?: AggregateOptions): Omit<this, 'then'> & {
        then: Then<boolean>;
    };
    _max(args: string, options?: AggregateOptions): Omit<this, 'then'> & {
        then: Then<boolean>;
    };
    sum(args: string, options?: AggregateOptions): Omit<this, 'then'> & {
        then: Then<boolean>;
    };
    _sum(args: string, options?: AggregateOptions): Omit<this, 'then'> & {
        then: Then<boolean>;
    };
    first(): Omit<this, 'then'> & {
        then: Then<Entity>;
    };
    _first(): Omit<this, 'then'> & {
        then: Then<Entity>;
    };
    first(limit: number): Omit<this, 'then'> & {
        then: Then<Entity[]>;
    };
    _first(limit: number): Omit<this, 'then'> & {
        then: Then<Entity[]>;
    };
    last(): Omit<this, 'then'> & {
        then: Then<Entity>;
    };
    _last(): Omit<this, 'then'> & {
        then: Then<Entity>;
    };
    last(limit: number): Omit<this, 'then'> & {
        then: Then<Entity[]>;
    };
    _last(limit: number): Omit<this, 'then'> & {
        then: Then<Entity[]>;
    };
}
export interface Config {
    camelCase?: boolean;
}
export interface Options {
    primaryKey?: string;
}
declare const porm: {
    (db: Adapter, { camelCase }?: {
        camelCase?: boolean | undefined;
    }): <Entity>(table: string, klass: new (...args: any) => Entity, options?: Options) => Model<Entity>;
    hidden({ constructor: target }: any, key: string): void;
    transaction: <T extends Record<string, Model<any>>>(models: T, fn: (models: T) => Promise<any>) => Promise<any[]>;
};
export default porm;

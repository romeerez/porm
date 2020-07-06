import { Model } from './model';
export declare type BelongsToOptions<T> = {
    primaryKey?: string;
    foreignKey?: string;
};
export declare const belongsTo: <T extends Model<any>, P>(self: any, fn: (params: P) => T, { primaryKey, foreignKey, }?: BelongsToOptions<T>) => () => {
    (params: P): Pick<T, Exclude<keyof T, "then">> & {
        then: import("./model").Then<any>;
    };
    json(as?: any, scope?: T): import("./model").ModelQuery<Model<any>>;
    subquery: (as?: any, scope?: T) => import("./model").ModelQuery<T>;
    sourceModel: import("./model").ModelQuery<T>;
};
export declare const hasThrough: <T, P>(self: Model<any>, model: T, joinQuery: any, sourceQuery: any, many: boolean) => any;
export declare type HasOptions<T> = {
    primaryKey?: string;
    foreignKey?: string;
    through?: string;
    source?: string;
};
export declare const has: <T extends Model<any>, P>(many: boolean, self: Model<any>, fn: (params: P) => T, { primaryKey, foreignKey, through, source }?: HasOptions<T>) => (name: string) => any;
export declare const hasOne: <T extends Model<any>, P>(self: Model<any>, fn: (params: P) => T, options?: HasOptions<T>) => (name: string) => any;
export declare const hasMany: <T extends Model<any>, P>(self: Model<any>, fn: (params: P) => T, options?: HasOptions<T>) => (name: string) => any;
export interface HasAndBelongsToManyOptions<T> {
    primaryKey?: string;
    foreignKey?: string;
    joinTable?: string;
    associationForeignKey?: string;
}
export declare const hasAndBelongsToMany: <T extends Model<any>, P>(self: Model<any>, fn: (params: P) => T, { primaryKey, foreignKey, joinTable, associationForeignKey, }?: HasAndBelongsToManyOptions<T>) => (name: string) => any;

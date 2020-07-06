export declare const User: import("../src/model").Model<{
    id: number;
}> & {
    profile: import("../src/model").Scope<Pick<import("../src/model").Model<{
        id: number;
        userId: number;
    }> & {
        active(this: import("../src/model").Model<{
            id: number;
            userId: number;
        }>): import("../src/model").ModelQuery<import("../src/model").Model<{
            id: number;
            userId: number;
        }>>;
    }, "hasMany" | "all" | "distinct" | "order" | "take" | "model" | "__query" | "config" | "db" | "table" | "quotedTable" | "primaryKey" | "quotedPrimaryKey" | "hiddenColumns" | "createdAtColumnName" | "updatedAtColumnName" | "deletedAtColumnName" | "aggregateSql" | "columns" | "columnNames" | "create" | "updateAll" | "update" | "deleteAll" | "delete" | "setDefaultScope" | "unscoped" | "belongsTo" | "hasOne" | "hasAndBelongsToMany" | "relations" | "scopes" | "prepare" | "_all" | "_take" | "rows" | "_rows" | "value" | "_value" | "exec" | "_exec" | "toSql" | "toQuery" | "clone" | "merge" | "_merge" | "_distinct" | "distinctRaw" | "_distinctRaw" | "select" | "_select" | "selectRaw" | "_selectRaw" | "include" | "_include" | "from" | "_from" | "as" | "_as" | "wrap" | "_wrap" | "json" | "_json" | "join" | "_join" | "where" | "_where" | "and" | "_and" | "or" | "_or" | "find" | "_find" | "findBy" | "_findBy" | "_order" | "orderRaw" | "_orderRaw" | "group" | "_group" | "groupRaw" | "_groupRaw" | "having" | "_having" | "window" | "_window" | "union" | "_union" | "unionAll" | "_unionAll" | "intersect" | "_intersect" | "intersectAll" | "_intersectAll" | "except" | "_except" | "exceptAll" | "_exceptAll" | "limit" | "_limit" | "offset" | "_offset" | "for" | "_for" | "exists" | "_exists" | "count" | "_count" | "avg" | "_avg" | "min" | "_min" | "max" | "_max" | "sum" | "_sum" | "first" | "_first" | "last" | "_last" | "active"> & {
        then: import("../src/model").Then<{
            id: number;
            userId: number;
        }>;
    }, {
        id: number;
    }>;
    profileWithScope: import("../src/model").Scope<Pick<import("../src/model").ModelQuery<import("../src/model").Model<{
        id: number;
        userId: number;
    }>>, "hasMany" | "all" | "distinct" | "order" | "take" | "model" | "__query" | "config" | "db" | "table" | "quotedTable" | "primaryKey" | "quotedPrimaryKey" | "hiddenColumns" | "createdAtColumnName" | "updatedAtColumnName" | "deletedAtColumnName" | "aggregateSql" | "columns" | "columnNames" | "create" | "updateAll" | "update" | "deleteAll" | "delete" | "setDefaultScope" | "unscoped" | "belongsTo" | "hasOne" | "hasAndBelongsToMany" | "relations" | "scopes" | "prepare" | "_all" | "_take" | "rows" | "_rows" | "value" | "_value" | "exec" | "_exec" | "toSql" | "toQuery" | "clone" | "merge" | "_merge" | "_distinct" | "distinctRaw" | "_distinctRaw" | "select" | "_select" | "selectRaw" | "_selectRaw" | "include" | "_include" | "from" | "_from" | "as" | "_as" | "wrap" | "_wrap" | "json" | "_json" | "join" | "_join" | "where" | "_where" | "and" | "_and" | "or" | "_or" | "find" | "_find" | "findBy" | "_findBy" | "_order" | "orderRaw" | "_orderRaw" | "group" | "_group" | "groupRaw" | "_groupRaw" | "having" | "_having" | "window" | "_window" | "union" | "_union" | "unionAll" | "_unionAll" | "intersect" | "_intersect" | "intersectAll" | "_intersectAll" | "except" | "_except" | "exceptAll" | "_exceptAll" | "limit" | "_limit" | "offset" | "_offset" | "for" | "_for" | "exists" | "_exists" | "count" | "_count" | "avg" | "_avg" | "min" | "_min" | "max" | "_max" | "sum" | "_sum" | "first" | "_first" | "last" | "_last"> & {
        then: import("../src/model").Then<{
            id: number;
            userId: number;
        }>;
    }, {
        id: number;
    }>;
};

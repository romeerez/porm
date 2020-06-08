import { QueryData, MQ } from "../types";
export declare const createQuery: (model: MQ, prev?: QueryData | undefined) => any;
export declare const pushArrayAny: (model: MQ, key: "window" | "select" | "group" | "and" | "or" | "distinct" | "distinctRaw" | "selectRaw" | "groupRaw" | "having" | "union" | "unionAll" | "intersect" | "intersectAll" | "except" | "exceptAll" | "order" | "orderRaw" | "join", args: any[]) => import("../types").Query;
export declare const setString: (model: MQ, key: "from" | "as" | "for", value: string) => import("../types").Query;
export declare const setNumber: (model: MQ, key: "limit" | "offset", value: number) => import("../types").Query;
export declare const setBoolean: (model: MQ, key: "take" | "exists", value: boolean) => import("../types").Query;

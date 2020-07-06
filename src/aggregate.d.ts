export declare type AggregateOptions = {
    distinct?: boolean;
    order?: string;
    filter?: string;
    withinGroup?: boolean;
};
export declare const aggregateSql: (functionName: string, args: string, { distinct, order, filter, withinGroup }?: AggregateOptions) => string;

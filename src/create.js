"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const pg_adapter_1 = require("pg-adapter");
const insert = async (model, columns, values, returning, records) => {
    const result = await model.db.arrays(`INSERT INTO ${model.quotedTable} (${columns.join(', ')}) VALUES ${values} RETURNING ${Array.isArray(returning) ? returning.map(c => `"${c}"`).join(', ') : returning}`);
    result.forEach((row, rowNum) => {
        const record = records[rowNum];
        row.forEach((value, i) => record[returning[i]] = value);
    });
    return records;
};
const createMany = (model, records, returning) => {
    const keys = {};
    const columns = [];
    const quoted = [];
    records.forEach(record => {
        for (let key in record)
            if (!keys[key]) {
                keys[key] = true;
                columns.push(key);
                quoted.push(`"${key}"`);
            }
    });
    const values = records.map((record) => `(${columns.map(column => pg_adapter_1.quote(record[column])).join(', ')})`);
    return insert(model, quoted, values.join(', '), returning, records);
};
const createOne = (model, record, returning) => insert(model, Object.keys(record).map(c => `"${c}"`), `(${Object.values(record).map(v => pg_adapter_1.quote(v)).join(', ')})`, returning, [record]);
exports.create = async (model, records, returning = `"${model.primaryKey}"`) => {
    if (Array.isArray(records))
        return await createMany(model, records, returning);
    else
        return (await createOne(model, records, returning))[0];
};

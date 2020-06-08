"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prototype_1 = require("./lib/prototype");
// import {relation} from './lib/relation'
exports.model = (db, table, def = {}) => {
    // const {relations} = def
    const model = Object.create(prototype_1.prototype);
    model.db = db;
    model.table = def.table || table;
    model.quotedTable = `"${model.table}"`;
    model.primaryKey = def.primaryKey || 'id';
    // if (relations)
    //   Object.keys(relations).forEach(as => {
    //     model[as] = relation(model, as, relations[as])
    //   })
    return model;
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.union = (type, args) => {
    const list = [];
    args.forEach(arg => {
        if (typeof arg === 'string')
            list.push(arg);
        else
            list.push(arg.toSql());
    });
    return `${type} ${list.join(` ${type} `)}`;
};

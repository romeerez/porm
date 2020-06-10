"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.window = void 0;
exports.window = (args) => {
    const list = [];
    args.forEach(arg => {
        for (let key in arg)
            list.push(`${key} AS (${arg[key]})`);
    });
    return list.join(', ');
};

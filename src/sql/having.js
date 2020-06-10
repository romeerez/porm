"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.having = void 0;
exports.having = (args) => {
    const list = [];
    args.forEach(arg => {
        list.push(arg);
    });
    return list.join(', ');
};

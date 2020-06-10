"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.join = void 0;
exports.join = ({ config: { camelCase } }, ...args) => camelCase ?
    `${args[0]}${args.slice(1).map(arg => `${arg[0].toUpperCase()}${arg.slice(1)}`)}` :
    args.join('_');

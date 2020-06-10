"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.line = void 0;
exports.line = (s) => s.trim()
    .replace(/\s+/g, ' ')
    .replace(/\( /g, '(')
    .replace(/ \)/g, ')');

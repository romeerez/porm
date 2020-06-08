"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.line = (s) => s.trim()
    .replace(/\s+/g, ' ')
    .replace(/\( /g, '(')
    .replace(/ \)/g, ')');

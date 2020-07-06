"use strict";
exports.__esModule = true;
exports.having = void 0;
exports.having = function (args) {
    var list = [];
    args.forEach(function (arg) {
        list.push(arg);
    });
    return list.join(', ');
};

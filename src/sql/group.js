"use strict";
exports.__esModule = true;
exports.group = void 0;
exports.group = function (table, args, argsRaw) {
    var list = [];
    if (args)
        args.forEach(function (arg) {
            list.push(table + ".\"" + arg + "\"");
        });
    if (argsRaw)
        argsRaw.forEach(function (arg) {
            list.push(arg);
        });
    return list.join(', ');
};

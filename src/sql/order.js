"use strict";
exports.__esModule = true;
exports.order = void 0;
exports.order = function (table, args, argsRaw) {
    var list = [];
    if (args)
        args.forEach(function (arg) {
            if (typeof arg === 'string')
                list.push(table + ".\"" + arg + "\"");
            else
                for (var key in arg) {
                    var value = arg[key];
                    if (typeof value === 'object') {
                        for (var name_1 in value) {
                            list.push("\"" + key + "\".\"" + name_1 + "\" " + value[name_1]);
                        }
                    }
                    else {
                        list.push(table + ".\"" + key + "\" " + arg[key]);
                    }
                }
        });
    if (argsRaw)
        argsRaw.forEach(function (arg) {
            list.push(arg);
        });
    return list.join(', ');
};

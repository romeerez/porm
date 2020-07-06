"use strict";
exports.__esModule = true;
exports.window = void 0;
exports.window = function (args) {
    var list = [];
    args.forEach(function (arg) {
        for (var key in arg)
            list.push(key + " AS (" + arg[key] + ")");
    });
    return list.join(', ');
};

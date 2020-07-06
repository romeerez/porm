"use strict";
exports.__esModule = true;
exports.join = void 0;
exports.join = function (_a) {
    var camelCase = _a.config.camelCase;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return camelCase ?
        "" + args[0] + args.slice(1).map(function (arg) { return "" + arg[0].toUpperCase() + arg.slice(1); }) :
        args.join('_');
};

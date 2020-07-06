"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.pushArrayAny = exports.setBoolean = exports.setStringOrPromise = exports.setString = exports.setNumber = exports.toQuery = exports.merge = exports.createQuery = void 0;
exports.createQuery = function (model, prev) {
    var object = Object.create(model);
    var query = {};
    Object.assign(object, { model: model, __query: query });
    if (prev)
        for (var key in prev)
            if (Array.isArray(prev[key]))
                query[key] = __spreadArrays(prev[key]);
            else
                query[key] = prev[key];
    return object;
};
exports.merge = function (model, args) {
    var object = model.__query ? model : exports.createQuery(model);
    var target = object.__query;
    args.forEach(function (_a) {
        var _b;
        var query = _a.__query;
        if (!query)
            return;
        for (var key in query)
            if (Array.isArray(query[key]))
                target[key] ? (_b = target[key]).push.apply(_b, query[key]) : target[key] = query[key];
            else
                target[key] = query[key];
    });
    return object;
};
exports.toQuery = function (model) {
    return (model.__query ? model : exports.createQuery(model));
};
exports.setNumber = function (model, key, value) {
    var query = model.toQuery();
    query.__query[key] = value;
    return query;
};
exports.setString = function (model, key, value) {
    var query = model.toQuery();
    query.__query[key] = value;
    return query;
};
exports.setStringOrPromise = function (model, key, value) {
    var query = model.toQuery();
    query.__query[key] = value;
    return query;
};
exports.setBoolean = function (model, key, value) {
    var query = model.toQuery();
    query.__query[key] = value;
    return query;
};
exports.pushArrayAny = function (model, key, args) {
    var query = model.toQuery();
    var value = query.__query[key];
    value ? value.push.apply(value, args) : query.__query[key] = args;
    return query;
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuery = (model, prev) => {
    const object = Object.create(model);
    const query = {};
    Object.assign(object, { model, __query: query });
    if (prev)
        for (let key in prev)
            if (Array.isArray(prev[key]))
                query[key] = [...prev[key]];
            else
                query[key] = prev[key];
    return object;
};
exports.pushArrayAny = (model, key, args) => {
    const query = model.toQuery();
    const value = query.__query[key];
    value ? value.push(...args) : query.__query[key] = args;
    return query;
};
exports.setString = (model, key, value) => {
    const query = model.toQuery();
    query.__query[key] = value;
    return query;
};
exports.setNumber = (model, key, value) => {
    const query = model.toQuery();
    query.__query[key] = value;
    return query;
};
exports.setBoolean = (model, key, value) => {
    const query = model.toQuery();
    query.__query[key] = value;
    return query;
};

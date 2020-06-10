"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushArrayAny = exports.setBoolean = exports.setString = exports.setNumber = exports.toQuery = exports.merge = exports.createQuery = void 0;
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
exports.merge = (model, args) => {
    const object = model.__query ? model : exports.createQuery(model);
    const target = object.__query;
    args.forEach(({ __query: query }) => {
        if (!query)
            return;
        for (let key in query)
            if (Array.isArray(query[key]))
                target[key] ? target[key].push(...query[key]) : target[key] = query[key];
            else
                target[key] = query[key];
    });
    return object;
};
exports.toQuery = (model) => {
    return (model.__query ? model : exports.createQuery(model));
};
exports.setNumber = (model, key, value) => {
    const query = model.toQuery();
    query.__query[key] = value;
    return query;
};
exports.setString = (model, key, value) => {
    const query = model.toQuery();
    query.__query[key] = value;
    return query;
};
exports.setBoolean = (model, key, value) => {
    const query = model.toQuery();
    query.__query[key] = value;
    return query;
};
exports.pushArrayAny = (model, key, args) => {
    const query = model.toQuery();
    const value = query.__query[key];
    value ? value.push(...args) : query.__query[key] = args;
    return query;
};

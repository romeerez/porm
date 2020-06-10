"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prepareQuery = jest.fn();
exports.default = {
    objects: jest.fn(() => ({ then: (resolve) => resolve() })),
    query: jest.fn(() => ({ then: (resolve) => resolve() })),
    arrays: jest.fn(() => ({ then: (resolve) => resolve() })),
    value: jest.fn(() => ({ then: (resolve) => resolve() })),
    exec: jest.fn(() => ({ then: (resolve) => resolve() })),
    prepare: jest.fn((name, ...args) => () => ({
        query: prepareQuery
    })),
    prepareQuery,
};

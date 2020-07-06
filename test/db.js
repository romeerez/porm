"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prepareQuery = jest.fn();
const db = {
    objects: jest.fn(() => ({ then: (resolve) => resolve() })),
    query: jest.fn(() => ({ then: (resolve) => resolve() })),
    arrays: jest.fn(() => ({ then: (resolve) => resolve() })),
    value: jest.fn(() => ({ then: (resolve) => resolve() })),
    exec: jest.fn(() => ({ then: (resolve) => resolve() })),
    prepare: jest.fn((name, ...args) => () => ({
        query: prepareQuery
    })),
    prepareQuery,
    transaction: jest.fn(async (fn) => {
        db.exec('BEGIN');
        const transaction = Object.create(db);
        await fn(db);
        db.exec('COMMIT');
    })
};
exports.default = db;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("../src"));
const db_1 = __importDefault(require("./db"));
const utils_1 = require("./utils");
const model = src_1.default(db_1.default);
const User = model('users', class {
});
describe('deleteAll', () => {
    it('deletes using query', () => {
        User.findBy('a = b').deleteAll('returning');
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      DELETE FROM "users"
      WHERE a = b
      LIMIT 1
      RETURNING returning
    `));
    });
});
describe('delete', () => {
    it('delete by id', () => {
        User.delete(1, 'id');
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      DELETE FROM "users"
      WHERE "users"."id" = 1
      RETURNING id
    `));
    });
    it('delete by array of ids', () => {
        User.delete([1, 2, 3], ['id', 'name']);
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      DELETE FROM "users"
      WHERE "users"."id" IN (1, 2, 3)
      RETURNING "id", "name"
    `));
    });
    it('delete by array of records', () => {
        User.delete([{ id: 1 }, { id: 2 }, { id: 3 }]);
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      DELETE FROM "users"
      WHERE "users"."id" IN (1, 2, 3)
    `));
    });
});

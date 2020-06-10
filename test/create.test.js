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
describe('create', () => {
    it('creates one record', () => {
        User.create({ name: 'vasya', role: 'user' });
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      INSERT INTO "users" ("name", "role")
      VALUES ('vasya', 'user')
      RETURNING "id"
    `));
    });
    it('creates multiple records', () => {
        User.create([{ name: 'vasya', role: 'user' }, { name: 'petya', role: 'admin' }]);
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      INSERT INTO "users" ("name", "role")
      VALUES ('vasya', 'user'), ('petya', 'admin')
      RETURNING "id"
    `));
    });
    it('creates record with custom returning', () => {
        User.create({ name: 'vasya', role: 'user' }, 'custom');
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      INSERT INTO "users" ("name", "role")
      VALUES ('vasya', 'user')
      RETURNING custom
    `));
    });
    it('creates record with returning of columns', () => {
        User.create({ name: 'vasya', role: 'user' }, ['id', 'name']);
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      INSERT INTO "users" ("name", "role")
      VALUES ('vasya', 'user')
      RETURNING "id", "name"
    `));
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("../src"));
const utils_1 = require("./utils");
const db_1 = __importDefault(require("./db"));
const model = src_1.default(db_1.default);
const User = model('users', class {
});
User.columns = async () => ({});
describe('transaction', () => {
    it('executes queries inside a transaction', async () => {
        db_1.default.arrays.mockReturnValueOnce([[1]]);
        await src_1.default.transaction({ User }, async ({ User }) => {
            await User.create({ name: 'Vasya' });
        });
        expect(db_1.default.transaction).toBeCalled();
        expect(db_1.default.exec).toBeCalledWith('BEGIN');
        expect(db_1.default.arrays).toBeCalledWith(utils_1.line(`
      INSERT INTO "users" ("name")
      VALUES ('Vasya')
      RETURNING "id"
    `));
        expect(db_1.default.exec).toBeCalledWith('COMMIT');
    });
});

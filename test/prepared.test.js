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
}).prepare((prepare, users) => ({
    searchByName: () => {
        const prepared = prepare(['text'], users.where('name = $1'));
        return (name) => prepared.query(name);
    }
}));
describe('prepared', () => {
    it('makes query using prepared statement', async () => {
        await User.searchByName('vasya');
        expect(db_1.default.prepare).toBeCalledWith('users_searchByName', 'text');
        expect(db_1.default.prepareQuery).toBeCalledWith(utils_1.line('vasya'));
    });
});

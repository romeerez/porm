"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("../src"));
const db_1 = __importDefault(require("./db"));
const utils_1 = require("./utils");
const model = src_1.default(db_1.default);
const Chat = model('chats', class {
}).scopes({
    active() {
        return this.where({ active: true });
    }
});
const User = model('users', class {
}).relations(({ hasAndBelongsToMany }) => ({
    chats: hasAndBelongsToMany((params) => Chat),
    chatsWithScope: hasAndBelongsToMany((params) => Chat.active())
}));
describe('hasAndBelongsToMany', () => {
    it('makes proper query', () => {
        const user = { id: 5 };
        expect(User.chats(user).toSql()).toBe(utils_1.line(`
      SELECT "chats".* FROM "chats"
      JOIN "chatsUsers"
        ON "chatsUsers"."userId" = 5
      WHERE "chats"."id" = "chatsUsers"."chatId"
    `));
        expect(User.chatsWithScope(user).toSql()).toBe(utils_1.line(`
      SELECT "chats".* FROM "chats"
      JOIN "chatsUsers"
        ON "chatsUsers"."userId" = 5
      WHERE "chats"."id" = "chatsUsers"."chatId"
        AND "chats"."active" = true
    `));
    });
    it('can be joined', () => {
        const q = User.all();
        expect(q.join('chats').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
        JOIN "chatsUsers"
          ON "chatsUsers"."userId" = "users"."id"
        JOIN "chats" ON "chats"."id" = "chatsUsers"."chatId"
    `));
        expect(q.join('chatsWithScope').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
        JOIN "chatsUsers"
          ON "chatsUsers"."userId" = "users"."id"
        JOIN "chats"
          ON "chats"."id" = "chatsUsers"."chatId"
         AND "chats"."active" = true
    `));
    });
    it('has json subquery', () => {
        expect(User.chats.json().toSql()).toBe(utils_1.line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "chats".* FROM "chats"
        JOIN "chatsUsers"
          ON "chatsUsers"."userId" = "users"."id"
        WHERE "chats"."id" = "chatsUsers"."chatId"
      ) "t"
    `));
        expect(User.chatsWithScope.json().toSql()).toBe(utils_1.line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "chats".* FROM "chats"
        JOIN "chatsUsers"
          ON "chatsUsers"."userId" = "users"."id"
        WHERE "chats"."id" = "chatsUsers"."chatId"
          AND "chats"."active" = true
      ) "t"
    `));
    });
});

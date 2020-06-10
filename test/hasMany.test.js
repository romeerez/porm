"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("../src"));
const db_1 = __importDefault(require("./db"));
const utils_1 = require("./utils");
const model = src_1.default(db_1.default);
const Message = model('messages', class {
}).scopes({
    active() {
        return this.where({ active: true });
    }
});
const Chat = model('chats', class {
}).relations(({ hasMany }) => ({
    messages: hasMany((params) => Message),
    messagesWithScope: hasMany((params) => Message.active())
}));
describe('hasMany', () => {
    it('makes proper query', () => {
        const chat = { id: 5 };
        expect(Chat.messages(chat).toSql()).toBe(utils_1.line(`
      SELECT "messages".* FROM "messages"
      WHERE "messages"."chatId" = ${chat.id}
    `));
        expect(Chat.messagesWithScope(chat).toSql()).toBe(utils_1.line(`
      SELECT "messages".* FROM "messages"
      WHERE "messages"."active" = true
        AND "messages"."chatId" = ${chat.id}
    `));
    });
    it('can be joined', () => {
        const q = Chat.all();
        expect(q.join('messages').toSql()).toBe(utils_1.line(`
      SELECT "chats".* FROM "chats"
      JOIN "messages" ON "messages"."chatId" = "chats"."id"
    `));
        expect(q.join('messagesWithScope').toSql()).toBe(utils_1.line(`
      SELECT "chats".* FROM "chats"
      JOIN "messages"
        ON "messages"."active" = true
       AND "messages"."chatId" = "chats"."id"
    `));
    });
    it('has json subquery', () => {
        expect(Chat.messages.json().toSql()).toBe(utils_1.line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "messages".* FROM "messages"
        WHERE "messages"."chatId" = "chats"."id"
      ) "t"
    `));
        expect(Chat.messagesWithScope.json().toSql()).toBe(utils_1.line(`
      SELECT COALESCE(json_agg(row_to_json("t".*)), '[]') AS json
      FROM (
        SELECT "messages".* FROM "messages"
        WHERE "messages"."active" = true
          AND "messages"."chatId" = "chats"."id"
      ) "t"
    `));
    });
});

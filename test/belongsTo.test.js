"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../src/index"));
const db_1 = __importDefault(require("./db"));
const utils_1 = require("./utils");
const model = index_1.default(db_1.default);
class Entity {
}
const Chat = model('chats', Entity).scopes({
    active() {
        return this.where({ active: true });
    }
});
const Message = model('messages', Entity).relations(({ belongsTo }) => ({
    chat: belongsTo((params) => Chat),
    chatWithScope: belongsTo((params) => Chat.active())
}));
describe('belongsTo', () => {
    it('makes proper query', async () => {
        const message = { chatId: 5 };
        expect(await Message.chat(message).toSql()).toBe(utils_1.line(`
      SELECT "chats".* FROM "chats"
      WHERE "chats"."id" = ${message.chatId}
      LIMIT 1
    `));
        expect(await Message.chatWithScope(message).toSql()).toBe(utils_1.line(`
      SELECT "chats".* FROM "chats"
      WHERE "chats"."active" = true
        AND "chats"."id" = ${message.chatId}
      LIMIT 1
    `));
    });
    it('can be joined', async () => {
        const q = Message.all();
        expect(await q.join('chat').toSql()).toBe(utils_1.line(`
      SELECT "messages".* FROM "messages"
      JOIN "chats"
        ON "chats"."id" = "messages"."chatId"
    `));
        expect(await q.join('chatWithScope').toSql()).toBe(utils_1.line(`
      SELECT "messages".* FROM "messages"
      JOIN "chats"
        ON "chats"."active" = true
       AND "chats"."id" = "messages"."chatId"
    `));
    });
    it('has json subquery', async () => {
        expect(await Message.chat.json().toSql()).toBe(utils_1.line(`
      SELECT COALESCE(row_to_json("t".*), '{}') AS json
      FROM (
        SELECT "chats".* FROM "chats"
        WHERE "chats"."id" = "messages"."chatId"
        LIMIT 1
      ) "t"
    `));
        expect(await Message.chatWithScope.json().toSql()).toBe(utils_1.line(`
      SELECT COALESCE(row_to_json("t".*), '{}') AS json
      FROM (
        SELECT "chats".* FROM "chats"
        WHERE "chats"."active" = true
          AND "chats"."id" = "messages"."chatId"
        LIMIT 1
      ) "t"
    `));
    });
});

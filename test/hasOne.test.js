"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const src_1 = __importDefault(require("../src"));
const db_1 = __importDefault(require("./db"));
const utils_1 = require("./utils");
const model = src_1.default(db_1.default);
const Profile = model('profiles', class {
}).scopes({
    active() {
        return this.where({ active: true });
    }
});
exports.User = model('users', class {
}).relations(({ hasOne }) => ({
    profile: hasOne((params) => Profile),
    profileWithScope: hasOne((params) => Profile.active())
}));
describe('hasOne', () => {
    it('makes proper query', async () => {
        const user = { id: 5 };
        expect(await exports.User.profile(user).toSql()).toBe(utils_1.line(`
      SELECT "profiles".* FROM "profiles"
      WHERE "profiles"."userId" = ${user.id}
      LIMIT 1
    `));
        expect(await exports.User.profileWithScope(user).toSql()).toBe(utils_1.line(`
      SELECT "profiles".* FROM "profiles"
      WHERE "profiles"."active" = true
        AND "profiles"."userId" = ${user.id}
      LIMIT 1
    `));
    });
    it('can be joined', async () => {
        const q = exports.User.all();
        expect(await q.join('profile').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      JOIN "profiles"
        ON "profiles"."userId" = "users"."id"
    `));
        expect(await q.join('profileWithScope').toSql()).toBe(utils_1.line(`
      SELECT "users".* FROM "users"
      JOIN "profiles"
        ON "profiles"."active" = true
       AND "profiles"."userId" = "users"."id"
    `));
    });
    it('has json subquery', async () => {
        expect(await exports.User.profile.json().toSql()).toBe(utils_1.line(`
      SELECT COALESCE(row_to_json("t".*), '{}') AS json
      FROM (
        SELECT "profiles".* FROM "profiles"
        WHERE "profiles"."userId" = "users"."id"
        LIMIT 1
      ) "t"
    `));
        expect(await exports.User.profileWithScope.json().toSql()).toBe(utils_1.line(`
      SELECT COALESCE(row_to_json("t".*), '{}') AS json
      FROM (
        SELECT "profiles".* FROM "profiles"
        WHERE "profiles"."active" = true
          AND "profiles"."userId" = "users"."id"
        LIMIT 1
      ) "t"
    `));
    });
});

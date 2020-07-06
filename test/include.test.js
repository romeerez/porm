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
const ProfileModel = model('profiles', class {
});
const UserModel = model('users', class {
});
const Profile = ProfileModel.relations(({ belongsTo }) => ({
    user: belongsTo((params) => UserModel)
}));
exports.User = UserModel.relations(({ hasOne }) => ({
    profile: hasOne((params) => Profile),
}));
describe('include', () => {
    describe('belongs to', () => {
        describe('string argument', () => {
            const expected = `
        SELECT "profiles".*, (
          SELECT COALESCE(row_to_json("t".*), '{}') AS json FROM (
            SELECT "users".*
            FROM "users"
            WHERE "users"."id" = "profiles"."userId"
            LIMIT 1
          ) "t"
        ) AS "user"
        FROM "profiles"
      `;
            it('includes by string argument', async () => {
                expect(await Profile.include('user').toSql()).toBe(utils_1.line(expected));
            });
            it('has modifier', async () => {
                const q = Profile.all();
                q._include('user');
                expect(await q.toSql()).toBe(utils_1.line(expected));
            });
        });
        describe('object argument', () => {
            const expected = `
        SELECT "profiles".*, (
          SELECT COALESCE(row_to_json("t".*), '{}') AS json FROM (
            SELECT "users".*
            FROM "users"
            WHERE "users"."id" = "profiles"."userId"
            LIMIT 1
          ) "t"
        ) AS "customName"
        FROM "profiles"
      `;
            it('includes relation with custom key', async () => {
                expect(await Profile.include({ user: 'customName' }).toSql()).toBe(utils_1.line(expected));
            });
            it('has modifier', async () => {
                const q = Profile.all();
                q._include({ user: 'customName' });
                expect(await q.toSql()).toBe(utils_1.line(expected));
            });
        });
        describe('object argument with query', () => {
            const expected = `
        SELECT "profiles".*, (
          SELECT COALESCE(row_to_json("t".*), '{}') AS json FROM (
            SELECT "customName".*
            FROM "users" "customName"
            WHERE a = b AND "customName"."id" = "profiles"."userId"
            LIMIT 1
          ) "t"
        ) AS "customName"
        FROM "profiles"
      `;
            it('includes relation with query', async () => {
                expect(await Profile.include({ user: exports.User.as('customName').where('a = b') }).toSql()).toBe(utils_1.line(expected));
            });
            // it('has modifier', async () => {
            //   const q = Profile.all()
            //   q._include({profile: User.as('customName').where('a = b')})
            //   expect(await q.toSql()).toBe(line(expected))
            // })
        });
    });
    describe('has one', () => {
        describe('string argument', () => {
            const expected = `
        SELECT "users".*, (
          SELECT COALESCE(row_to_json("t".*), '{}') AS json FROM (
            SELECT "profiles".*
            FROM "profiles"
            WHERE "profiles"."userId" = "users"."id"
            LIMIT 1
          ) "t"
        ) AS "profile"
        FROM "users"
      `;
            it('includes by string argument', async () => {
                expect(await exports.User.include('profile').toSql()).toBe(utils_1.line(expected));
            });
            it('has modifier', async () => {
                const q = exports.User.all();
                q._include('profile');
                expect(await q.toSql()).toBe(utils_1.line(expected));
            });
        });
        describe('object argument', () => {
            const expected = `
        SELECT "users".*, (
          SELECT COALESCE(row_to_json("t".*), '{}') AS json FROM (
            SELECT "profiles".*
            FROM "profiles"
            WHERE "profiles"."userId" = "users"."id"
            LIMIT 1
          ) "t"
        ) AS "customName"
        FROM "users"
      `;
            it('includes relation with custom key', async () => {
                expect(await exports.User.include({ profile: 'customName' }).toSql()).toBe(utils_1.line(expected));
            });
            it('has modifier', async () => {
                const q = exports.User.all();
                q._include({ profile: 'customName' });
                expect(await q.toSql()).toBe(utils_1.line(expected));
            });
        });
        describe('object argument with query', () => {
            const expected = `
        SELECT "users".*, (
          SELECT COALESCE(row_to_json("t".*), '{}') AS json FROM (
            SELECT "customName".*
            FROM "profiles" "customName"
            WHERE a = b AND "customName"."userId" = "users"."id"
            LIMIT 1
          ) "t"
        ) AS "customName"
        FROM "users"
      `;
            it('includes relation with query', async () => {
                expect(await exports.User.include({ profile: Profile.as('customName').where('a = b') }).toSql()).toBe(utils_1.line(expected));
            });
            it('has modifier', async () => {
                const q = exports.User.all();
                q._include({ profile: Profile.as('customName').where('a = b') });
                expect(await q.toSql()).toBe(utils_1.line(expected));
            });
        });
    });
});

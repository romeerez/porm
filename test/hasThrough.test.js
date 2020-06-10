"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("../src"));
const db_1 = __importDefault(require("./db"));
const utils_1 = require("./utils");
const model = src_1.default(db_1.default);
describe('hasThrough', () => {
    // [true, false].forEach(one => {
    [true].forEach(one => {
        const Country = model('countries', class {
        }).scopes({
            active() {
                return this.where({ active: true });
            }
        });
        const User = model('users', class {
        }).relations(({ belongsTo }) => ({
            country: belongsTo((params) => Country)
        }));
        describe(`${one ? 'hasOne' : 'hasMany'} through belongsTo`, () => {
            const Profile = model('profiles', class {
            }).relations(({ belongsTo, hasOne, hasMany }) => ({
                user: belongsTo((params) => User),
                country: (one ? hasOne : hasMany)((params) => Country.active(), { through: 'user' })
            }));
            it('makes proper query', () => {
                const profile = { userId: 5 };
                expect(Profile.country(profile).toSql()).toBe(utils_1.line(`
          SELECT "countries".* FROM "countries"
          JOIN "users" ON "users"."id" = 5
          WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
          ${one ? 'LIMIT 1' : ''}
        `));
            });
            it('can be joined', () => {
                expect(Profile.join('country').toSql()).toBe(utils_1.line(`
          SELECT "profiles".* FROM "profiles"
          JOIN "users" ON "users"."id" = "profiles"."userId"
          JOIN "countries" ON "countries"."id" = "users"."countryId" AND "countries"."active" = true
        `));
            });
            it('has json subquery', () => {
                expect(Profile.country.json().toSql()).toBe(utils_1.line(`
          SELECT COALESCE(
            ${one ? '' : 'json_agg('}row_to_json("t".*)${one ? ',' : '),'}
            ${one ? "'{}'" : "'[]'"}
            ) AS json
          FROM (
            SELECT "countries".* FROM "countries"
            JOIN "users" ON "users"."id" = "profiles"."userId"
            WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
            ${one ? 'LIMIT 1' : ''}
          ) "t"
        `));
            });
        });
        describe(`${one ? 'hasOne' : 'hasMany'} through hasOne`, () => {
            const Profile = model('profiles', class {
            }).relations(({ belongsTo, hasOne, hasMany }) => ({
                user: hasOne((params) => User),
                country: (one ? hasOne : hasMany)((params) => Country.active(), { through: 'user' })
            }));
            it('makes proper query', () => {
                const profile = { id: 5 };
                expect(Profile.country(profile).toSql()).toBe(utils_1.line(`
          SELECT "countries".* FROM "countries"
          JOIN "users" ON "users"."profileId" = 5
          WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
          ${one ? 'LIMIT 1' : ''}
        `));
            });
            it('can be joined', () => {
                expect(Profile.join('country').toSql()).toBe(utils_1.line(`
          SELECT "profiles".* FROM "profiles"
          JOIN "users" ON "users"."profileId" = "profiles"."id"
          JOIN "countries" ON "countries"."id" = "users"."countryId" AND "countries"."active" = true
        `));
            });
            it('has json subquery', () => {
                expect(Profile.country.json().toSql()).toBe(utils_1.line(`
          SELECT COALESCE(
            ${one ? '' : 'json_agg('}row_to_json("t".*)${one ? ',' : '),'}
            ${one ? "'{}'" : "'[]'"}
            ) AS json
          FROM (
            SELECT "countries".* FROM "countries"
            JOIN "users" ON "users"."profileId" = "profiles"."id"
            WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
            ${one ? 'LIMIT 1' : ''}
          ) "t"
        `));
            });
        });
        describe(`${one ? 'hasOne' : 'hasMany'} through hasMany`, () => {
            const Team = model('teams', class {
            }).relations(({ hasOne, hasMany }) => ({
                users: hasMany((params) => User),
                country: (one ? hasOne : hasMany)((params) => Country.active(), { through: 'users' })
            }));
            it('makes proper query', () => {
                const team = { id: 5 };
                expect(Team.country(team).toSql()).toBe(utils_1.line(`
          SELECT "countries".* FROM "countries"
          JOIN "users" ON "users"."teamId" = 5
          WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
          ${one ? 'LIMIT 1' : ''}
        `));
            });
            it('can be joined', () => {
                expect(Team.join('country').toSql()).toBe(utils_1.line(`
          SELECT "teams".* FROM "teams"
          JOIN "users" ON "users"."teamId" = "teams"."id"
          JOIN "countries"
            ON "countries"."id" = "users"."countryId" AND "countries"."active" = true
        `));
            });
            it('has json subquery', () => {
                expect(Team.country.json().toSql()).toBe(utils_1.line(`
          SELECT COALESCE(
            ${one ? '' : 'json_agg('}row_to_json("t".*)${one ? ',' : '),'}
            ${one ? "'{}'" : "'[]'"}
            ) AS json
          FROM (
            SELECT "countries".* FROM "countries"
            JOIN "users" ON "users"."teamId" = "teams"."id"
            WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
            ${one ? 'LIMIT 1' : ''}
          ) "t"
        `));
            });
        });
        describe(`${one ? 'hasOne' : 'hasMany'} through hasHasAndBelongsToMany`, () => {
            const Chat = model('chats', class {
            }).relations(({ hasAndBelongsToMany, hasOne, hasMany }) => ({
                users: hasAndBelongsToMany((params) => User),
                country: (one ? hasOne : hasMany)((params) => Country.active(), { through: 'users' })
            }));
            it('makes proper query', () => {
                const chat = { id: 5 };
                expect(Chat.country(chat).toSql()).toBe(utils_1.line(`
          SELECT "countries".* FROM "countries"
          JOIN "chatsUsers" ON "chatsUsers"."chatId" = 5
          JOIN "users" ON "users"."id" = "chatsUsers"."userId"
          WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
          ${one ? 'LIMIT 1' : ''}
        `));
            });
            it('can be joined', () => {
                expect(Chat.join('country').toSql()).toBe(utils_1.line(`
          SELECT "chats".* FROM "chats"
          JOIN "chatsUsers" ON "chatsUsers"."chatId" = "chats"."id"
          JOIN "users" ON "users"."id" = "chatsUsers"."userId"
          JOIN "countries" ON "countries"."id" = "users"."countryId" AND "countries"."active" = true
        `));
            });
            it('has json subquery', () => {
                expect(Chat.country.json().toSql()).toBe(utils_1.line(`
          SELECT COALESCE(
            ${one ? '' : 'json_agg('}row_to_json("t".*)${one ? ',' : '),'}
            ${one ? "'{}'" : "'[]'"}
            ) AS json
          FROM (
            SELECT "countries".* FROM "countries"
            JOIN "chatsUsers" ON "chatsUsers"."chatId" = "chats"."id"
            JOIN "users" ON "users"."id" = "chatsUsers"."userId"
            WHERE "countries"."id" = "users"."countryId" AND "countries"."active" = true
            ${one ? 'LIMIT 1' : ''}
          ) "t"
        `));
            });
        });
    });
});

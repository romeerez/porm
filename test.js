"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const porm_1 = require("./src/porm");
const pg_adapter_1 = require("pg-adapter");
const db = pg_adapter_1.Adapter.fromURL('postgres://dev:@localhost:5432/porm');
const Profile = porm_1.model(db, 'profiles', {
// relations: {
//   user: {
//     hasMany: () => User
//   }
// }
});
const User = porm_1.model(db, 'users', {
// relations: {
//   profile: {
//     belongsTo: () => Profile
//   }
// },
// prepared: () => ({
//   preparedQuery: {
//     args: ['string'],
//     query: User.where('name = $1')
//   }
// }),
// scopes: {
//   active: (users) => users.where({active: true})
// }
});
const main = async () => {
    const user = await User.take();
    console.log(user.id, user.koko);
};
main();

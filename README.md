# porm

Postgres ORM.

Features:

- Easy to use query interface
- Models relations:
  * *belonsTo*
  * *hasOne* and *hasMany*, *through* option supported
  * *hasAndBelongsToMany*
- Plain data structures
- Efficient loading of related tables data

Designed to use with TypeScript only.

For migrations, I suggest trying [rake-db](https://www.npmjs.com/package/rake-db)

## Brief example of main feature

Here is brief example how easy is to combine multiple tables into one json result.

Imagine that we are building another messenger, with users and chat rooms.

User record has one profile, chat record has many messages, message belongs to user, users have many chats.

Now let's get single json of all records together! Let's leave model definitions for later.

Select all chats:

```ts
const result = await Chat.include({
  messages: Message.include({
    user: User.include('profile')
  })
}).json()
```

It produces single SQL query and returns JSON like this:

```json
[{
  "id": 1,
  "title": "chat title",
  "messages": [{
    "id": 1,
    "text": "message text",
    "userId": 1,
    "user": {
      "id": 1,
      "name": "user name",
      "profileId": 1,
      "profile": {
        "id": 1,
        "photo": "url to photo"
      }
    }
  }]
}]
```

That's all, this was the main reason to create this library.

As I know, no other js library for postgres can do such a basic thing.

## Examples of most common operations

```ts
const allUsers = await User.all()
const count = await User.count()
const trueOfFalse = await User.where({name: 'John'}).exists()
const randomUser = await User.take()
const first = await User.first() // ordered by id, first is object, typescript know it's type
const first5 = await User.first(5) // ordered by id, first5 is array, typescript is aware of types too
const last = await User.last() // get the latest created user
const last5 = await User.last(5) // get the latest created user
const byId = await User.find(1) // where id = 1, find returns single user object

const exampleOfQueryInterface = await (
  User.select('id', 'name')
      .join('profile') // profile is a hasOne relation in this case
      .where({name: 'Bob'}).or({name: 'Alice'})
      .order({id: 'desc'})
      .limit(5)
      .offset(10)
)

const createdUser = await User.create({name: 'Bob'})
const createdUserArray = await User.create([{name: 'John'}, {name: 'Peter'}])

const updatedUser = await User.update(createdUser, {name: 'New name'})
const updatedUserUsingId = await User.update(1, {name: 'New name'})
const updateAll = await User.where({name: 'Old name'}).updateAll({name: 'New name'})

await User.delete(1) // Delete user with id = 1
await User.delete([1, 2, 3]) // Delete users where id is one of 1, 2 3
await User.where('something').deleteAll() // delete all by condition
```

## Get started

You can place models wherever you like.

Personally I prefer suggestion from [node best practices](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.md)

*Good: Structure your solution by self-contained components*

*Bad: Group your files by technical role*

And project could use such structure:

```
- project
  - src
    - app // much shorter than "components"
      - user
        model.ts // model goes here
        api.ts // layer between router and logic, other people may name it "controller"
        actions.ts // such as log in, sign up etc, other people may name it "service"
    - config
      model.ts // configure db connection here
  package.json and others
```

To define connection settings (`src/config/model.ts`):

```ts
import {Adapter} from "pg-adapter"
import porm from 'porm'

const db = Adapter.fromURL('postgres://postgres:@localhost:5432/porm')
export default porm(db, {camelCase: true}) // by default camelCase is turned on, you can switch it off here
```

Read about how to configure database here: [pg-adapter](https://www.npmjs.com/package/pg-adapter)

To define user model (`src/app/user/model.ts`):

```ts
import porm from 'porm'
import model from 'config/model'

export const UserModel = model('users', class UserEntity {
  id: number
  name: string
  
  @porm.hidden
  password: string
})

export const User = UserModel // explanation later
```

First argument 'users' is table name to use.

Second argument is class with column types for typescript.
It could be interface instead of class, but to be able to use decorators this is class.

`@porm.hidden` marks column as hidden by default, so `await User.take` will return user without a password.

To get such hidden column you must specify it in select:
`await User.select('*')` or `await User.select('id', 'name', 'password')`

Next thing to do is define relations. Our user has profile (`src/app/profile/model.ts`):

```ts
import model from 'config/model'
import {UserModel} from 'app/user/model'

export const ProfileModel = model('users', class UserEntity {
  id: number
  name: string
})

export const Profile = ProfileModel.relations(({belongsTo}) => ({
  user: belongsTo((params: {userId}) => UserModel)
}))
```

And user model:

```ts
import {ProfileModel} from 'app/profile/model'

// ...skip some code from above

export const User = UserModel.relations(({hasOne}) => ({
  profile: hasOne((params: {id: number}) => ProfileModel)
}))
```

Additional `UserModel` and `ProfileModel` is needed only to avoid circular dependencies.

So `User` use `ProfileModel`, and `Profile` use `UserModel`, no problems with dependencies.

Yes, syntax may seem weird.
Believe me, I tried to make it in many ways, this syntax won in order to provide as much typescript info as possible for further usage.

How to get profile of user:

```ts
import User from 'app/user/model'

const user = {id: 1}
const profile = await User.profile(user) // here is where type is used: (params: {id: number}) => ProfileModel

profile.id // OK

profile.foo // TypeScript error

User.profile({foo: 1}) // TypeScript error
```

## Scopes

Scopes are functions to reuse queries.

```ts
export const Product = model('products').scopes({
  cheap() {
    return this.where('price < 100').or('discount > 20')
  },

  fresh() {
    return this.where(`"createdAt" > now() - '3 days'::interval`)
  },

  search(value: string) {
    value = `%${value}%`
    return this.where`name ILIKE ${value}`.or`description ILIKE ${value}`
  },
})
```

Last example demonstrates using template strings.

With such syntax you can pass arguments from outside, they will be escaped, no worries about SQL injections.

Use scopes:

```ts
import Product from 'app/product/model'

const products = await Product.cheap().fresh().search('doughnut')
```

## Docs

Hundreds of features left uncovered, please let me know that you are interested giving a star in repo, and I will write complete docs soon.

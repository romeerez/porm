# porm

Postgres ORM.

I wanted to name it `pgorm`, then flash, `porm` is great name for a great library!

Features:

- Similar to ActiveRecord query interface
- Models relations:
  * *belonsTo*, polymorphic option supported
  * *hasOne* and *hasMany*, through option supported
  * *hasAndBelongsToMany*
- Plain data structures
- Efficient loading of related tables data

I consider main feature is loading related data using JSON aggregations from Postgres.
About this read in the first section.

In further examples `db` variable will be instance of [pg-adapter](https://www.npmjs.com/package/pg-adapter):

```js
const {Adapter} = require('pg-adapter')

const db = new Adapter({params})
```

## Table of Contents
* [Loading data from related tables](#loading-data-from-related-tables)
* [Getting started](#getting-started)
* [Define models](#define-models)
  - [Relations](#relations)
    * [belongsTo](#belongsto)
    * [hasOne](#hasone)
    * [hasMany](#hasmany)
    * [hasAndBelongsToMany](#hasandbelongstomany)
  - [Scopes](#scopes)
  - [Query Interface](#query-interface)

## Loading data from related tables

Let's have such database tables:

- user has one profile and many chats
- profile belongs to user
- chats have many users and many messages
- message belongs to chat

You have an ID of the user and want to load all this data,
chats and messages should be loaded ordered by `created_at` column,
here goes this ORM:

```js
const result = db.users.select('*', 'profile', {
  chats: db.users.chats.select('*', {
    messages: db.chats.messages.order({created_at: 'desc'}),
  }).order({created_at: 'desc'})
}).take().json()
```

I don't sure if it is readable enough, it can be rewrited with variables:

```js
const messages = db.chats.messages.order({created_at: 'desc'})
const chats = db.users.chats.select('*', {messages}).order({created_at: 'desc'})
const result = db.users.select('*', 'profile', {chats}).take().json()
```

## Getting started

Install:

```bash
npm i porm
yarn add porm
```

Then create database, create tables, I recommend
[rake-db](https://www.npmjs.com/package/rake-db)
for it.

`porm` depends on connection provided by [pg-adapter](https://www.npmjs.com/package/pg-adapter):

## Define models

In case of very small application models could be defined in one file:

```js
const {models, hasMany, belongsTo} = require('porm')
const {Adapter} = require('pg-adapter')

const db = new Adapter({params})

module.exports = models(db, {
  artists: {
    songs: hasMany()
  },
  songs: {
    artist: belongsTo()
  },
})
```

Normally each in separate file:

```js
// db/models/artists.js
const {hasMany} = require('porm')

module.exports = {
  songs: hasMany()
}

// db/models/songs.js
const {belongsTo} = require('porm')

module.exports = {
  artist: belongsTo()
}

// db/index.js
const {models} = require('porm')
const {Adapter} = require('pg-adapter')

const db = new Adapter({params})

module.exports = models(db, {
  artists: require('./models/artists'),
  songs: require('./models/songs'),
})

// usage.js
const db = require('db')

const artists = await db.artists.all()
```

Options:

```js
models(db, {
  samples: {
    table: 'samples', // can be some other name
    defaultScope: (query) => query.where({hidden: false})
  }
})

// filtered samples by default
const samples = await db.samples.all()

// use unscoped to get all samples
const allSamples = await db.samples.unscoped()
```

### Relations

There are [belongsTo](#belongsto), [hasOne](#hasone),
[hasMany](#hasmany) and [hasAndBelongsToMany](#hasandbelongstomany) relations.

Currently there are duplications in relation definition, it will be shortened soon.

#### belongsTo

Options are `scope`, `primaryKey`, `foreignKey`, `polymorphic`

```js
const {models, belongsTo} = require('pg-adapter')

models(db, {
  countries: {},
  cities: {
    // options are optional
    country: belongsTo(),
    
    // with options:
    country: belongsTo({
      primaryKey: 'id', // id column of other table
      foreignKey: 'country_id', // column in current table
      polymorphic: false,
      scope: (country) => country.where('filter somehow'),
    }),
  },
})

const city = {country_id: 5}
const country = await db.city.country(city)
```

Polymorphic:

```js
const {models, belongsTo} = require('pg-adapter')

models(db, {
  pictures: {
    imageable: belongsTo({polymorphic: true})
  }
})

const picture = {imageable_id: 1, imageable_type: 'users'}
const user = await db.pictures.imageable(picture)
```

Don't use polymorphic in cases when it's easy to use several tables instead.
It is harder to maintain and less efficient for database.

#### hasOne

Options are `primaryKey`, `foreignKey`, `through`, `as`, `scope`

```js
const {models, hasOne} = require('pg-adapter')

models(db, {
  profiles: {},
  users: {
    // options are optional:
    profile: hasOne(),
    
    // with options:
    profile: hasOne({
      primaryKey: 'id', // id column of this table (of users)
      foreignKey: 'user_id', // column in other table (in profiles)
      scope: (profile) => profile.where('some condition'),
    })
  },
})

const user = {id: 3}
const profile = await db.users.profile(user)
```

Relation `through`:

```js
models(db, {
  accounts: {
    user: hasOne(),
    profile: hasOne({
      through: 'user',
    })
  }
})

const account = {id: 7}
const profile = await db.accounts.profile(account)
```

Polymorphic relation using `as`:

```js
const {models, belongsTo, hasOne} = require('porm')

models(db, {
  pictures: {
    imageable: belongsTo({polymorphic: true})
  },
  employees: {
    picture: hasOne({as: 'imageable'})
  },
  products: {
    picture: hasOne({as: 'imageable'})
  }
})

const employee = {id: 8}
const employeePicture = await db.employees.picture(employee)
const product = {id: 2}
const productPicture = await db.products.picture(product)
```

#### hasMany

Options are `primaryKey`, `foreignKey`, `through`, `as`, `scope`

```js
const {models, hasMany} = require('pg-adapter')

models(db, {
  books: {},
  authors: {
    // options are optional:
    books: hasMany(),
    
    // with options:
    books: hasMany({
      primaryKey: 'id', // id column of this table (of authors)
      foreignKey: 'author_id', // column in other table (in books)
      scope: (books) => books.where('some condition'),
    })
  },
})

const author = {id: 3}
const books = await db.authors.books(author)
```

Relation `through`:

```js
models(db, {
  physicians: {
    appointments: hasMany(),
    patients: hasMany({through: 'appointments'})
  },
  appointments: {
    physician: belongsTo(),
    patient: belongsTo(),
  },
  patients: {
    appointments: hasMany(),
    physicians: hasMany({through: 'appointments'})
  },
})

const physician = {id: 1}
const patients = await db.physicians.patients(physician)
const patient = {id: 2}
const physicians = await db.patients.physicians(patient)
```

Polymorphic relation using `as`:

```js
const {models, belongsTo, hasMany} = require('porm')

models(db, {
  pictures: {
    imageable: belongsTo({polymorphic: true})
  },
  employees: {
    pictures: hasMany({as: 'imageable'})
  },
  products: {
    pictures: hasMany({as: 'imageable'})
  }
})

const employee = {id: 8}
const employeePictures = await db.employees.pictures(employee)
const product = {id: 2}
const productPictures = await db.products.pictures(product)
```

#### hasAndBelongsToMany

Options are `joinTable`, `foreignKey`, `associationForeignKey`, `scope`

It is like `hasMeny({through})` but without defining model in between. 

```js
const {models, hasAndBelongsToMany} = require('pg-adapter')

models(db, {
  posts: {
    tags: hasAndBelongsToMany({
      joinTable: 'posts_tags', // by default is joining table names alphabetically
      foreignKey: 'post_id', // for record of this table
      associationForeignKey: 'tag_id', // for record of other table
      scope: (tags) => tags.where('filter tags'),
    }),
  },
  tags: {
    posts: hasAndBelongsToMany()
  }
})

const post = {id: 10}
const tags = db.posts.tags(post)
```

## Scopes

Scopes allow to not write same queries again and again:

```js
const {sql} = require('pg-adapter')

models(db, {
  samples: {
    defaultScope: (samples) => samples.where({deleted_at: null}),
    
    scopes: {
      newest: (samples) => samples.order({created_at: 'desc'}),
      
      newerThan: (samples, date) =>
        samples.where(sql`created_at > ${date}`)
    }
  }
})
```

## Query interface

`unscoped()` clears all query info

`all()` initialize query, also discards `take()` method

`take()` gets only one record

`toSql()` returns generated sql query

`find(id)` find one record by given id

`wrap(query, as = 't')` wraps current query into another query:

```js
const apples = db.apples.select('column', 'created_at')
const oranges = db.oranges.select('column', 'created_at')

// db.base is a special model without table
const orderedApplesAndOranges =
  await db.apples.union(db.oranges).wrap( // inner query
    db.base.order({created_at: 'desc'}) // outer query
  )

// will query such sql:
sql`
SELECT *
FROM (
  SELECT * FROM apples
  UNION
  SELECT * FROM oranges
) t
ORDER BY created_at desc
`
```

`objects()` by default, query will return array of objects

`arrays()` will return array of arrays of values, no keys

`value()` will return single value

`json()` result will be json string, it uses Postgres json aggregations

`then()` executes the query, usually invoked by `await` keyword

`as(string)` alias table name

`distinct(...args)` add `DISTINCT` keyword.
Arguments the same as in `select`, if provided it gave `DISTINCT ON (...)`

`distinctRaw(sql)` results in `DISTINT ON (sql)` query

`select` and `selectRaw` requires examples:

```js
db.table.select('column_a', 'column_b')
// select columns

db.table.select({firstName: 'name'})
// select name AS firstName

db.table.select({otherTable: db.otherTable.all()})
// select json result of other query AS otherTable

db.table.selectRaw('raw sql')
// select as is
```

`from(source)` changes `FROM` statement

`where` and `and` are same methods:

```js
const query = db.table

query.where('a').and('b')
// WHERE a AND b

query.where({column: 'value'})
// WHERE "someTable"."column" = 'value'

query.where({otherTable: {column: 'value'}})
// WHERE "table"."column" = 'value'

// it accept queries:
query.where({a: 1}, query.where({b: 2}).or({c: 3, d: 4}))
// WHERE "table"."a" = 1 AND ( "table"."b" = 2 OR "table"."c" = 3 AND "table"."d" = 4 )
```

`or`:

```js
const query = db.table

query.or('a', 'b')
// WHERE a OR b

query.or({a: 1}, {b: 2})
// WHERE "table"."a" = 1 OR "table"."b" = 2
query.where({a: 1}).or({b: 2})
// same as above

// it accept queries:
query.or({a: 1}, query.where({b: 2}).or({c: 3}))
// WHERE "table"."a" = 1 OR ( "table"."b" = 2 OR "table"."c" = 3 )
```

`group` and `groupRaw` for GROUP BY statement:

```js
db.table.group('id', 'name')
// GROUP BY "table"."id", "table"."name"

db.table.groupRaw('id', 'name')
// GROUP BY id, name
```

`having` raw sql to `HAVING` statement:

```js
db.table.having('sum(rating) > 30', 'count(id) > 5')
// HAVING sum(rating) > 30, count(id) > 5
```

`window`:

```js
db.table.window({w: 'PARTITION BY depname ORDER BY salary DESC'})
// WINDOW w AS (PARTITION BY depname ORDER BY salary DESC)
```

`union`:

```js
db.one.union(db.two.all(), db.three.all())
// gives:
sql`
  SELECT * FROM one
  UNION
  SELECT * FROM two
  UNION
  SELECT * FROM three
`
```

`unionAll`, `intersect`, `intersectAll`, `except`, `exceptAll`
are the same as `union` but with different statements

`order` and `orderRaw`:

```js
db.table.order('id')
// ORDER "table"."id"

db.table.order({name: 'desc', age: 'asc nulls first'})
// ORDER "table"."name" desc, "table"."age" asc nulls first

db.table.order({otherTable: {column: 'desc'}})
// ORDER "otherTable"."column" desc

db.table.orderRaw('sql')
// ORDER sql
```

`offset` sets `OFFSET`

`limit` sets `LIMIT`

`for` something advances, `FOR` statement sets blocking table rules

`join`:

```js
db.table.join('otherTable', 'alias', 'raw conditions')
// JOIN "otherTable" AS "alias" ON raw conditions

db.table.join(db.otherTable.as('alias').where({a: 1}))
// JOIN "otherTable" AS "alias" ON "alias"."a" = 1

// can join related tables
const {models, belongsTo} = require('porm')
models(db, {
  posts: {authors: belongsTo()},
  authors: {}
})

db.posts.join('authors')
// JOIN "authors" ON "authors"."id" = "posts"."author_id"
```

```js
module.exports = {
  join(...args) {
    return this.clone()._join(...args)
  },

  _join(...args) {
    const query = this.toQuery()
    const q = query.__query
    if (q.join)
      q.join.push(args)
    else
      q.join = [args]
    return query
  },
}
```

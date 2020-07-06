import {Adapter, Prepared} from "pg-adapter"
import {
  Query, toQuery, createQuery, merge, setNumber, setString, setStringOrPromise, setBoolean, pushArrayAny
} from "./query"
import {toSql} from "./sql"
import {create} from './create'
import {update} from './update'
import {destroy} from './delete'
import {
  belongsTo, BelongsToOptions,
  hasOne, hasMany, HasOptions,
  hasAndBelongsToMany, HasAndBelongsToManyOptions
} from './relations'
import {transaction} from './transaction'
import {aggregateSql, AggregateOptions} from './aggregate'
import {join} from './utils'
import {ColumnDefinition} from "./extraTypes"

export type ModelQuery<Model> = Model & {
  __query: Query
}

export type Then<T> = (this: Model<T>, resolve?: (value: T) => any, reject?: (error: any) => any) =>
  Promise<T | never>

export type Scope<T, P> = {
  (params: P): T
  subquery: () => T
  json: () => T
  many: boolean
  sourceModel: Model<any>
}

export type ScopeOne<T extends Model<T>, P> = Scope<ReturnType<T['take']>, P>

export type ScopeAll<T extends Model<T>, P> = Scope<ReturnType<T['all']>, P>

export type IdParameter<Entity> = number | string | Partial<Entity> | (number | string | Partial<Entity>)[]

const findByIdParameter = (model: Model<any>, id: IdParameter<any>) => {
  if (typeof id === 'object')
    if (Array.isArray(id))
      id = id.map(record =>
        typeof record === 'object' ? (record as any)[model.primaryKey] : record
      )
    else
      id = (id as any)[model.primaryKey] as number | string

  return model.where({[model.primaryKey]: id})
}

export interface Model<Entity> {
  model: this
  __query?: Query
  config: Config
  db: Adapter,
  table: string
  quotedTable: string
  primaryKey: string
  quotedPrimaryKey: string
  hiddenColumns: string[]
  createdAtColumnName: string
  updatedAtColumnName: string
  deletedAtColumnName: string

  aggregateSql: typeof aggregateSql

  columns(): Promise<Record<string, ColumnDefinition>>
  columnNames(): Promise<string[]>

  create<T extends Partial<Entity>>(records: T, returning?: string | string[]): Entity
  create<T extends Partial<Entity>>(records: T[], returning?: string | string[]): Entity[]

  updateAll<T>(set: string | Record<string, any>, returning?: string | string[]): Promise<T[]>
  update<T>(id: IdParameter<Entity>, set: string | Record<string, any>, returning?: string | string[]): Promise<T[]>

  deleteAll<T>(returning?: string | string[]): Promise<T[]>
  delete<T>(id: IdParameter<Entity>, returning?: string | string[]): Promise<T[]>

  setDefaultScope(scope: (model: Model<Entity>) => ModelQuery<this>): void
  unscoped(): ModelQuery<this>

  belongsTo<T extends Model<any>, P>
    (fn: (params: P) => T, options?: BelongsToOptions<T>): ScopeOne<T, P>

  hasOne<T extends Model<any>, P>
    (fn: (params: P) => T, options?: HasOptions<T>): ScopeOne<T, P>

  hasMany<T extends Model<any>, P>
    (fn: (params: P) => T, options?: HasOptions<T>): ScopeAll<T, P>

  hasAndBelongsToMany<T extends Model<any>, P>
    (fn: (params: P) => T, options?: HasAndBelongsToManyOptions<T>): ScopeAll<T, P>

  relations<T extends {[key: string]: any}>
    (fn: (model: Model<Entity>) => T): this & T

  scopes<T extends {[key: string]: (this: Model<Entity>, ...args: any[]) => Model<Entity>}>
    (scopes: T): this & T

  prepare<T extends Record<string, () => any>>
    (
      fn: (
        prepare: (args: string[], query: Model<any>) => Promise<Prepared>,
        model: Model<Entity>
      ) => T
    ): {[K in keyof T]: ReturnType<T[K]>} & Model<Entity>

  then: Then<Entity[]>
  all(): Omit<this, 'then'> & {then: Then<Entity[]>}
  _all(): Omit<this, 'then'> & {then: Then<Entity[]>}
  take(): Omit<this, 'then'> & {then: Then<Entity>}
  _take(): Omit<this, 'then'> & {then: Then<Entity>}
  rows(): Omit<this, 'then'> & {then: Then<any[][]>}
  _rows(): Omit<this, 'then'> & {then: Then<any[][]>}
  value(): Omit<this, 'then'> & {then: Then<any>}
  _value(): Omit<this, 'then'> & {then: Then<any>}
  exec(): Omit<this, 'then'> & {then: Then<void>}
  _exec(): Omit<this, 'then'> & {then: Then<void>}
  toSql(): Promise<string>
  toQuery(): ModelQuery<this>
  clone(): ModelQuery<this>
  merge(...args: ModelQuery<any>[]): ModelQuery<this>
  _merge(...args: ModelQuery<any>[]): ModelQuery<this>
  distinct(...args: any[]): ModelQuery<this>
  _distinct(...args: any[]): ModelQuery<this>
  distinctRaw(...args: any[]): ModelQuery<this>
  _distinctRaw(...args: any[]): ModelQuery<this>
  select(...args: any[]): ModelQuery<this>
  _select(...args: any[]): ModelQuery<this>
  selectRaw(...args: any[]): ModelQuery<this>
  _selectRaw(...args: any[]): ModelQuery<this>
  include(...args: any[]): ModelQuery<this>
  _include(...args: any[]): ModelQuery<this>
  from(source: string | Promise<string>): ModelQuery<this>
  _from(source: string | Promise<string>): ModelQuery<this>
  as(as: string): ModelQuery<this>
  _as(as: string): ModelQuery<this>
  wrap(query: Model<any>, as?: string): ModelQuery<this>
  _wrap(query: Model<any>, as?: string): ModelQuery<this>
  json(): ModelQuery<this>
  _json(): ModelQuery<this>
  join(...args: any[]): ModelQuery<this>
  _join(...args: any[]): ModelQuery<this>
  where(...args: any[]): ModelQuery<this>
  _where(...args: any[]): ModelQuery<this>
  and(...args: any[]): ModelQuery<this>
  _and(...args: any[]): ModelQuery<this>
  or(...args: any[]): ModelQuery<this>
  _or(...args: any[]): ModelQuery<this>
  find(id: any): ReturnType<this['take']>
  _find(id: any): ReturnType<this['take']>
  findBy(...args: any[]): ReturnType<this['take']>
  _findBy(...args: any[]): ReturnType<this['take']>
  order(...args: any[]): ModelQuery<this>
  _order(...args: any[]): ModelQuery<this>
  orderRaw(...args: any[]): ModelQuery<this>
  _orderRaw(...args: any[]): ModelQuery<this>
  group(...args: any[]): ModelQuery<this>
  _group(...args: any[]): ModelQuery<this>
  groupRaw(...args: any[]): ModelQuery<this>
  _groupRaw(...args: any[]): ModelQuery<this>
  having(...args: any[]): ModelQuery<this>
  _having(...args: any[]): ModelQuery<this>
  window(...args: any[]): ModelQuery<this>
  _window(...args: any[]): ModelQuery<this>
  union(...args: any[]): ModelQuery<this>
  _union(...args: any[]): ModelQuery<this>
  unionAll(...args: any[]): ModelQuery<this>
  _unionAll(...args: any[]): ModelQuery<this>
  intersect(...args: any[]): ModelQuery<this>
  _intersect(...args: any[]): ModelQuery<this>
  intersectAll(...args: any[]): ModelQuery<this>
  _intersectAll(...args: any[]): ModelQuery<this>
  except(...args: any[]): ModelQuery<this>
  _except(...args: any[]): ModelQuery<this>
  exceptAll(...args: any[]): ModelQuery<this>
  _exceptAll(...args: any[]): ModelQuery<this>
  limit(value: number): ModelQuery<this>
  _limit(value: number): ModelQuery<this>
  offset(value: number): ModelQuery<this>
  _offset(value: number): ModelQuery<this>
  for(value: string): ModelQuery<this>
  _for(value: string): ModelQuery<this>
  exists(): Omit<this, 'then'> & {then: Then<boolean>}
  _exists(): Omit<this, 'then'> & {then: Then<boolean>}
  count(args?: string, options?: AggregateOptions): Omit<this, 'then'> & {then: Then<boolean>}
  _count(args?: string, options?: AggregateOptions): Omit<this, 'then'> & {then: Then<boolean>}
  avg(args: string, options?: AggregateOptions): Omit<this, 'then'> & {then: Then<boolean>}
  _avg(args: string, options?: AggregateOptions): Omit<this, 'then'> & {then: Then<boolean>}
  min(args: string, options?: AggregateOptions): Omit<this, 'then'> & {then: Then<boolean>}
  _min(args: string, options?: AggregateOptions): Omit<this, 'then'> & {then: Then<boolean>}
  max(args: string, options?: AggregateOptions): Omit<this, 'then'> & {then: Then<boolean>}
  _max(args: string, options?: AggregateOptions): Omit<this, 'then'> & {then: Then<boolean>}
  sum(args: string, options?: AggregateOptions): Omit<this, 'then'> & {then: Then<boolean>}
  _sum(args: string, options?: AggregateOptions): Omit<this, 'then'> & {then: Then<boolean>}
  first(): Omit<this, 'then'> & {then: Then<Entity>}
  _first(): Omit<this, 'then'> & {then: Then<Entity>}
  first(limit: number): Omit<this, 'then'> & {then: Then<Entity[]>}
  _first(limit: number): Omit<this, 'then'> & {then: Then<Entity[]>}
  last(): Omit<this, 'then'> & {then: Then<Entity>}
  _last(): Omit<this, 'then'> & {then: Then<Entity>}
  last(limit: number): Omit<this, 'then'> & {then: Then<Entity[]>}
  _last(limit: number): Omit<this, 'then'> & {then: Then<Entity[]>}
}

export interface Config {
  camelCase?: boolean
}

export interface Options {
  primaryKey?: string
}

const porm = (db: Adapter, {camelCase = true} = {}) =>
  <Entity>(table: string, klass: new (...args: any) => Entity, options: Options = {}) => {
    const config = {camelCase}

    const self = {
      db,
      table,
      config,
      aggregateSql,

      model: null as any,
      quotedTable: `"${table}"`,
      primaryKey: options.primaryKey || 'id',
      quotedPrimaryKey: `"${options.primaryKey || 'id'}"`,
      hiddenColumns: (klass as any).hiddenColumns || [],
      createdAtColumnName: join({config}, 'created', 'at'),
      updatedAtColumnName: join({config}, 'updated', 'at'),
      deletedAtColumnName: join({config}, 'deleted', 'at'),

      columns() {
        if ((this.model as any).columnsPromise)
          return (this.model as any).columnsPromise

        return (this.model as any).columnsPromise = new Promise(async resolve => {
          const columns: Record<string, ColumnDefinition> = {}
          const array = await db.query
            `SELECT * FROM information_schema.columns WHERE table_name = ${table}` as ColumnDefinition[]
          array.forEach(column => columns[column.column_name] = column)
          resolve(columns)
        })
      },

      async columnNames() {
        return Object.keys(await this.columns())
      },

      create(records: any, returning: any) {
        return create(this, records, returning) as any
      },

      deleteAll(returning) {
        return destroy(this, returning)
      },

      delete(id, returning) {
        return destroy(findByIdParameter(this, id), returning)
      },

      updateAll(set, returning) {
        return update(this, set, returning)
      },

      update(id, set, returning) {
        return update(findByIdParameter(this, id), set, returning, typeof id === 'object' && id)
      },

      setDefaultScope(scope) {
        (this as any).toQuery = function() {
          return this.__query ? this : scope(createQuery(this))
        }
      },

      unscoped() {
        return createQuery(this)
      },

      belongsTo: () => null as any,
      hasOne: () => null as any,
      hasMany: () => null as any,
      hasAndBelongsToMany: () => null as any,
      then: () => null as any,

      relations(fn) {
        const model = this as any
        const relations = fn(model)
        for (let key in relations)
          model[key] = relations[key](key)
        return model
      },

      scopes(scopes) {
        for (let key in scopes)
          (this as any)[key] = (...args: any[]) => scopes[key].apply(this.toQuery(), args)
        return this
      },

      prepare(fn) {
        let key: string
        const preparer = async (args: string[], query: Model<any>) => {
          const sql = await query.toSql()
          return this.db.prepare(`${this.table}_${key}`, ...args)([sql] as any)
        }
        const prepared = fn(preparer, this)
        for (key in prepared)
          (this as any)[key] = prepared[key]()
        return this
      },

      all() {
        const q = this.toQuery()
        if (q.__query.take)
          return q.clone()._all()
        return q
      },

      _all() {
        const model = this.toQuery() as any as Omit<typeof self, 'then'> & {then: Then<Entity[]>}
        model.then = thenAll
        if (model.__query && model.__query.take) {
          model.then = thenAll
          delete model.__query.take
        }
        return model
      },

      take() {
        return this.clone()._take()
      },

      _take() {
        const model = this.toQuery() as any as Omit<typeof self, 'then'> & {then: Then<Entity>}
        model.then = thenOne;
        (model.__query as Query).take = true
        return model
      },

      rows() {
        return this.clone()._rows()
      },

      _rows() {
        const model = this as any as Omit<typeof self, 'then'> & {then: Then<any[][]>}
        model.then = thenRows
        return model
      },

      value() {
        return this.clone()._value()
      },

      _value() {
        const model = this as any as Omit<typeof self, 'then'> & {then: Then<any>}
        model.then = thenValue
        return model
      },

      exec() {
        return this.clone()._exec()
      },

      _exec() {
        const model = this as any as Omit<typeof self, 'then'> & {then: Then<void>}
        model.then = thenVoid
        return model
      },

      toSql() {
        return toSql(this.toQuery())
      },

      toQuery() {
        return toQuery(this)
      },

      clone() {
        return createQuery((this as any).model || this, (this as any).__query as Query)
      },

      merge(...args) {
        return this.clone()._merge(...args)
      },

      _merge(...args) {
        return merge(this, args)
      },

      distinct(...args) {
        return this.clone()._distinct(...args)
      },

      _distinct(...args) {
        if (args[0] === false) {
          this.__query && delete this.__query.distinct
          return this.toQuery()
        }
        return pushArrayAny(this, 'distinct', args)
      },

      distinctRaw(...args) {
        return this.clone()._distinctRaw(...args)
      },

      _distinctRaw(...args) {
        if (args[0] === false) {
          this.__query && delete this.__query.distinctRaw
          return this.toQuery()
        }
        return pushArrayAny(this, 'distinctRaw', args)
      },

      select(...args) {
        return this.clone()._select(...args)
      },

      _select(...args) {
        return pushArrayAny(this, 'select', args)
      },

      selectRaw(...args) {
        return this.clone()._selectRaw(...args)
      },

      _selectRaw(...args) {
        return pushArrayAny(this, 'selectRaw', args)
      },

      include(...args) {
        return this.clone()._include(...args)
      },

      _include(...args) {
        return pushArrayAny(this, 'include', args)
      },

      from(source) {
        return this.clone()._from(source)
      },

      _from(source) {
        return setStringOrPromise(this, 'from', source)
      },

      as(as) {
        return this.clone()._as(as)
      },

      _as(as) {
        return setString(this, 'as', as)
      },

      wrap(query, as = 't') {
        return this.clone()._wrap(query.clone(), as)
      },

      _wrap(query, as = 't') {
        return query._as(as)._from(new Promise(async resolve => {
          resolve(`(${await this.toQuery().toSql()})`)
        }))
      },

      json() {
        return this.clone()._json()
      },

      _json() {
        const query = this.toQuery()
        const q = query.__query
        let sql
        if (q.take)
          sql = `COALESCE(row_to_json("t".*), '{}') AS json`
        else
          sql = `COALESCE(json_agg(row_to_json("t".*)), '[]') AS json`
        return this._wrap(query.model.selectRaw(sql))._value()
      },

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

      where(...args) {
        return this.and(...args)
      },

      _where(...args) {
        return this._and(...args)
      },

      and(...args) {
        return this.clone()._and(...args)
      },

      _and(...args) {
        return pushArrayAny(this, 'and', args)
      },

      or(...args) {
        return this.clone()._or(...args)
      },

      _or(...args) {
        return pushArrayAny(this, 'or', args)
      },

      find(id) {
        return this.clone()._find(id)
      },

      _find(id) {
        return this._and({[this.primaryKey]: id})._take()
      },

      findBy(...args) {
        return this.clone()._findBy(...args)
      },

      _findBy(...args) {
        return this._where(...args)._take()
      },

      order(...args) {
        return this.clone()._order(...args)
      },

      _order(...args) {
        return pushArrayAny(this, 'order', args)
      },

      orderRaw(...args) {
        return this.clone()._orderRaw(...args)
      },

      _orderRaw(...args) {
        return pushArrayAny(this, 'orderRaw', args)
      },

      group(...args) {
        return this.clone()._group(...args)
      },

      _group(...args) {
        return pushArrayAny(this, 'group', args)
      },

      groupRaw(...args) {
        return this.clone()._groupRaw(...args)
      },

      _groupRaw(...args) {
        return pushArrayAny(this, 'groupRaw', args)
      },

      having(...args) {
        return this.clone()._having(...args)
      },

      _having(...args) {
        return pushArrayAny(this, 'having', args)
      },


      window(...args) {
        return this.clone()._window(...args)
      },

      _window(...args) {
        return pushArrayAny(this, 'window', args)
      },

      union(...args) {
        return this.clone()._union(...args)
      },

      _union(...args) {
        return pushArrayAny(this, 'union', args)
      },

      unionAll(...args) {
        return this.clone()._unionAll(...args)
      },

      _unionAll(...args) {
        return pushArrayAny(this, 'unionAll', args)
      },

      intersect(...args) {
        return this.clone()._intersect(...args)
      },

      _intersect(...args) {
        return pushArrayAny(this, 'intersect', args)
      },

      intersectAll(...args) {
        return this.clone()._intersectAll(...args)
      },

      _intersectAll(...args) {
        return pushArrayAny(this, 'intersectAll', args)
      },

      except(...args) {
        return this.clone()._except(...args)
      },

      _except(...args) {
        return pushArrayAny(this, 'except', args)
      },

      exceptAll(...args) {
        return this.clone()._exceptAll(...args)
      },

      _exceptAll(...args) {
        return pushArrayAny(this, 'exceptAll', args)
      },

      limit(value) {
        return this.clone()._limit(value)
      },

      _limit(value) {
        return setNumber(this, 'limit', value)
      },

      offset(value) {
        return this.clone()._offset(value)
      },

      _offset(value) {
        return setNumber(this, 'offset', value)
      },

      for(value) {
        return this.clone()._for(value)
      },

      _for(value) {
        return setString(this, 'for', value)
      },

      exists() {
        return this.clone()._exists()
      },

      _exists() {
        return this._selectRaw('1').value()
      },

      count(args, options) {
        return this.clone()._count(args, options)
      },

      _count(args = '*', options) {
        return this._selectRaw(this.aggregateSql('count', args, options))._value()
      },

      avg(args, options) {
        return this.clone()._avg(args, options)
      },

      _avg(args, options) {
        return this._selectRaw(this.aggregateSql('avg', args, options))._value()
      },

      min(args, options) {
        return this.clone()._min(args, options)
      },

      _min(args, options) {
        return this._selectRaw(this.aggregateSql('min', args, options))._value()
      },

      max(args, options) {
        return this.clone()._max(args, options)
      },

      _max(args, options) {
        return this._selectRaw(this.aggregateSql('max', args, options))._value()
      },

      sum(args, options) {
        return this.clone()._sum(args, options)
      },

      _sum(args, options) {
        return this._selectRaw(this.aggregateSql('sum', args, options))._value()
      },

      first(limit?: number) {
        return (this.clone() as any)._first(limit)
      },

      _first(limit?: number) {
        if (limit)
          return this.order(this.primaryKey).limit(limit).all()
        return this.order(this.primaryKey).take()
      },

      last(limit?: number) {
        return (this.clone() as any)._last(limit)
      },

      _last(limit?: number) {
        if (limit)
          return this.order({[this.primaryKey]: 'DESC'}).limit(limit).all()
        return this.order({[this.primaryKey]: 'DESC'}).take()
      },
    } as Model<Entity>

    self.model = self

    self.belongsTo = (fn, options) =>
      belongsTo(self, fn, options) as any

    self.hasOne = (fn, options) =>
      hasOne(self, fn, options) as any

    self.hasMany = (fn, options) =>
      hasMany(self, fn, options) as any

    self.hasAndBelongsToMany = (fn, options) =>
      hasAndBelongsToMany(self, fn, options) as any

    const thenAll: Then<Entity[]> = function(resolve, reject) {
      return (this.db.query(this.toSql()) as Promise<Entity[]>).then(resolve, reject)
    }

    const thenOne: Then<Entity> = function(resolve, reject) {
      return (this.db.query(this.toSql()) as Promise<Entity[]>).then(([record]) => resolve && resolve(record), reject)
    }

    const thenRows: Then<any[][]> = function(resolve, reject) {
      return this.db.arrays(this.toSql()).then(resolve as any, reject)
    }

    const thenValue: Then<any> = function(resolve, reject) {
      return this.db.value(this.toSql()).then(resolve, reject)
    }

    const thenVoid: Then<void> = function(resolve, reject) {
      return this.db.exec(this.toSql()).then(resolve as any, reject)
    }

    self.then = thenAll

    return self
  }


porm.hidden = ({constructor: target}: any, key: string) => {
  if (!target.hiddenColumns) target.hiddenColumns = []
  target.hiddenColumns.push(key)
}

porm.transaction = transaction

export default porm

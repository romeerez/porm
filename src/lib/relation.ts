import {Model, RelationQuery, SubQuery, Relation, BelongsTo, Scope} from '../types'
import {singular} from 'pluralize'

const createProxy = (
  self: Model, query: RelationQuery, subquery: SubQuery, take: boolean, sourceModel: Model
) => {
  query.__subquery = subquery
  query.associationTake = take
  query.sourceModel = sourceModel

  return new Proxy(query, {
    get: (target, name) =>
      name in query ? (query as any)[name] : (subquery() as any)[name]
  })
}

const belongsTo = (
  self: Model,
  as: string,
  take: boolean,
  {belongsTo: getModel, primaryKey, foreignKey, scope}: BelongsTo
) => {
  const model = getModel()
  const table = model.table
  if (!primaryKey) primaryKey = model.primaryKey
  let fk = foreignKey || `${singular(table)}_${primaryKey}`
  const selfTable = self.table

  let q = take ? model.take() : model.toQuery()
  if (!scope) scope = q => q

  const query = (record: any) => {
    const scoped = (scope as Scope)(q)
    const pk = `"${model.table}"."${primaryKey}"`
    return scoped.where(`${pk} = ${record[fk]}`)
  }

  const subquery = () => {
    const scoped = (scope as Scope)(q)
    const pk = `"${model.table}"."${primaryKey}"`
    return scoped.where(`${pk} = "${selfTable}"."${fk}"`)
  }

  return createProxy(self, query, subquery, take, model)
}

export const relation = (self: Model, as: string, config: Relation) => {
  if (config.hasOwnProperty('belongsTo'))
    return belongsTo(self, as, true, config as BelongsTo)
  // else if (config.has)
}
import {Model, Query} from "../../types"
import {where} from './where'

const joinSql = (args: any[]) => {
  const sql = [`"${args[0]}"`]

  let cond
  if (args.length === 3) {
    sql.push('AS', `"${args[1]}"`)
    cond = args[2]
  } else
    cond = args[1]

  sql.push('ON', cond)

  return `JOIN ${sql.join(' ')}`
}

const joinAssociation = (model: Model, as: string, name: string) => {
  if (!(model as any)[name] || !(model as any)[name].__subquery)
    throw new Error(`can not join ${name} to ${model.table}`)
  return [(model as any)[name].__subquery(as)]
}

const joinQuery = (sql: string[], _: any, as: string, query: Query) => {
  const q = query.__query
  const {model} = query

  if (q.join)
    q.join.forEach(args => {
      join(sql, model, as, args)
    })

  let cond
  if (q.as)
    cond = where(`"${q.as}"`, q.and, q.or)
  else
    cond = where(model.quotedTable, q.and, q.or)

  if (!cond)
    cond = '1'

  if (q.as)
    return [model.table, q.as, cond]
  else
    return [model.table, cond]
}

export const join = (sql: string[], model: Model, as: string, args: any[]) => {
  if (args.length === 1) {
    if (typeof args[0] === 'string')
      args = joinAssociation(model, as, args[0])
    if (typeof args[0] === 'object')
      args = joinQuery(sql, model, as, args[0])
  }

  sql.push(joinSql(args))
}

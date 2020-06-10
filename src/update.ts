import {quote} from 'pg-adapter'

import {Model} from './model'
import {where} from './sql/where'

export const update = async (model: Model<any>, set: string | Record<string, any>, returning?: string | string[]) => {
  const query = model.__query || {}

  const sql = [`UPDATE ${model.quotedTable}`]

  if (query.as)
    sql.push(`"${query.as}"`)

  const table = query.as ? `"${query.as}"` : model.quotedTable

  if (typeof set === 'object') {
    const values: string[] = []
    for (let key in set)
      values.push(`${table}."${key}" = ${quote(set[key])}`)
    sql.push('SET', values.join(', '))
  } else
    sql.push('SET', set)


  if (query.from)
    sql.push(query.from)

  const whereSql = where(table, query.and, query.or)
  if (whereSql)
    sql.push('WHERE', whereSql)

  if (returning)
    sql.push(`RETURNING ${
      Array.isArray(returning) ? returning.map(ret => `"${ret}"`).join(', ') : returning
    }`)

  return model.db.arrays(sql.join(' '))
}

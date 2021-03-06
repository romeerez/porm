import { quote } from 'pg-adapter'

import { Model, ModelQuery } from './model'
import { where } from './sql/where'

export const update = async <T, S extends Record<string, unknown>>(
  model: ModelQuery<Model<T>> | Model<T>,
  set: string | S,
  returning?: string | string[],
  object?: T,
) => {
  const query = model.__query || {}

  const sql = [`UPDATE ${model.quotedTable}`]

  if (query.as) sql.push(`"${query.as}"`)

  const modelColumns = await model.columns()
  const { updatedAtColumnName } = model
  let updatedAt: Date | undefined
  if (modelColumns[updatedAtColumnName]) {
    updatedAt = new Date()
  }

  if (typeof set === 'object') {
    const values: string[] = []
    for (const key in set) values.push(`"${key}" = ${quote(set[key])}`)
    if (updatedAt)
      values.push(`"${updatedAtColumnName}" = '${updatedAt.toISOString()}'`)
    sql.push('SET', values.join(', '))
  } else {
    if (updatedAt)
      set += `, "${updatedAtColumnName}" = '${updatedAt.toISOString()}'`
    sql.push('SET', set)
  }

  if (query.from) sql.push(await query.from)

  const table = query.as ? `"${query.as}"` : model.quotedTable
  const whereSql = where(table, query.and, query.or)
  if (whereSql) sql.push('WHERE', whereSql)

  if (returning)
    sql.push(
      `RETURNING ${
        Array.isArray(returning)
          ? returning.map((ret) => `"${ret}"`).join(', ')
          : returning
      }`,
    )

  const result = await model.db.arrays(sql.join(' '))

  if (object && typeof set === 'object') {
    Object.assign(object, set)
    if (updatedAt)
      ((object as unknown) as Record<string, Date>)[
        updatedAtColumnName
      ] = updatedAt
  }

  return result
}

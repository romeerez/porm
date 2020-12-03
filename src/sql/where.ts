import { quote } from 'pg-adapter'
import { Query } from 'query'

type WhereArg = string | { __query: Query } | Record<string, unknown>

const whereAnd = (table: string, args: WhereArg[]) => {
  const list: string[] = []
  args.forEach((arg) => {
    if (typeof arg === 'string') list.push(arg)
    else if (typeof arg === 'object') {
      const query = arg.__query as Query
      if (query) {
        const value = []
        if (query.and) value.push(whereAnd(table, query.and))
        if (query.or) value.push(whereOr(table, query.or))
        list.push(`(${value.join(' OR ')})`)
      } else
        for (const key in arg) {
          const value = (arg as Record<string, unknown>)[key]
          if (typeof value === 'object')
            if (value === null) list.push(`${table}."${key}" IS NULL`)
            else if (Array.isArray(value))
              list.push(`${table}."${key}" IN (${value.map(quote).join(', ')})`)
            else
              for (const column in value)
                list.push(
                  `"${key}"."${column}" = ${quote(
                    (value as Record<string, unknown>)[column],
                  )}`,
                )
          else list.push(`${table}."${key}" = ${quote(value)}`)
        }
    }
  })
  return list.join(' AND ')
}

const whereOr = (table: string, args: WhereArg[]) => {
  const list: string[] = []
  args.forEach((arg) => {
    if (typeof arg === 'string') list.push(arg)
    else if (arg !== null && arg !== undefined && typeof arg === 'object') {
      const query = arg.__query as Query
      if (query) {
        const value = []
        if (query.and) value.push(whereAnd(table, query.and))
        if (query.or) value.push(whereOr(table, query.or))
        list.push(`(${value.join(' OR ')})`)
      } else {
        list.push(whereAnd(table, [arg]))
      }
    }
  })
  return list.join(' OR ')
}

export const where = (table: string, and?: WhereArg[], or?: WhereArg[]) => {
  const andSql = []
  if (and) andSql.push(whereAnd(table, and))
  if (or) {
    if (andSql.length) andSql.push(' OR ')
    andSql.push(whereOr(table, or))
  }
  if (andSql.length) return andSql.join('')
}

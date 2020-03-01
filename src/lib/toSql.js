const select = require('./toSql/select')
const join = require('./toSql/join')
const where = require('./toSql/where')
const group = require('./toSql/group')
const having = require('./toSql/having')
const window = require('./toSql/window')
const union = require('./toSql/union')
const order = require('./toSql/order')

module.exports = function({model, __query: query}) {
  const sql = []

  sql.push('SELECT')
  const table = query.as ? `"${query.as}"` : model.quotedTable

  const distinct = select(model, table, query.distinct, false)
  const distinctRaw = select(model, table, query.distinctRaw, true)
  if (query.distinct || query.distinctRaw) {
    sql.push('DISTINCT')
    if (distinct || distinctRaw) {
      let both = distinct
      if (distinctRaw)
        both = both ? `${both}, ${distinctRaw}` : distinctRaw
      sql.push('ON', `(${both})`)
    }
  }

  if (query.select)
    sql.push(select(model, table, query.select, false))
  else if (query.selectRaw)
    sql.push(select(model, table, query.selectRaw, true))
  else if (!query.select)
    sql.push(`${table}.*`)

  sql.push('FROM', query.from || model.quotedTable)
  if (query.as)
    sql.push(`"${query.as}"`)

  if (query.join)
    query.join.forEach(args =>
      join(sql, model, query.as || model.table, args)
    )

  const whereSql = where(table, query.and, query.or)
  if (whereSql)
    sql.push('WHERE', whereSql)

  if (query.group || query.groupRaw)
    sql.push('GROUP BY', group(table, query.group, query.groupRaw))

  if (query.having)
    sql.push('HAVING', having(query.having))

  if (query.window)
    sql.push('WINDOW', window(query.window))

  if (query.union)
    sql.push(union('UNION', query.union))
  if (query.unionAll)
    sql.push(union('UNION ALL', query.unionAll))
  if (query.intersect)
    sql.push(union('INTERSECT', query.intersect))
  if (query.intersectAll)
    sql.push(union('INTERSECT ALL', query.intersectAll))
  if (query.except)
    sql.push(union('EXCEPT', query.except))
  if (query.exceptAll)
    sql.push(union('EXCEPT ALL', query.exceptAll))

  if (query.order || query.orderRaw)
    sql.push('ORDER BY', order(table, query.order, query.orderRaw))

  if (query.take)
    query.limit = 1
  if (query.limit)
    sql.push('LIMIT', query.limit)

  if (query.offset)
    sql.push('OFFSET', query.offset)

  if (query.for)
    sql.push('FOR', query.for)

  return sql.join(' ')
}

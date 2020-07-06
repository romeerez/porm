import {Model} from '../model'
import {Query} from '../query'
import {select} from './select'
import {join} from './join'
import {where} from './where'
import {group} from './group'
import {having} from './having'
import {include} from './include'
import {window} from './window'
import {union} from './union'
import {order} from './order'

export const toSql = async ({model, __query: query}: {model: Model<any>, __query: Query}) => {
  const sql: string[] = ['SELECT']

  const as = query.as || model.table
  const quotedAs = `"${as}"`

  const distinctList: string[] = []
  if (query.distinct)
    await select(distinctList, model, quotedAs, query.distinct, false)
  if (query.distinctRaw)
    await select(distinctList, model, quotedAs, query.distinctRaw, true)
  if (query.distinct || query.distinctRaw) {
    sql.push('DISTINCT')
    if (distinctList.length)
      sql.push('ON', `(${distinctList.join(', ')})`)
  }

  if (!query.select && !query.selectRaw && model.hiddenColumns.length) {
    const hidden = model.hiddenColumns
    query.select = (await model.columnNames()).filter(column =>
      !hidden.includes(column)
    )
  }

  let selectList: string[] = []
  if (query.select)
    await select(selectList, model, quotedAs, query.select, false)
  else if (query.selectRaw)
    await select(selectList, model, quotedAs, query.selectRaw, true)
  else
    selectList.push(`${quotedAs}.*`)

  if (query.include)
    await include(selectList, model, as, query.include)

  sql.push(selectList.join(', '))

  sql.push('FROM', query.from ? await query.from : model.quotedTable)
  if (query.as)
    sql.push(`"${query.as}"`)

  if (query.join)
    query.join.forEach(args =>
      join(sql, model, as, args)
    )

  const whereSql = where(quotedAs, query.and, query.or)
  if (whereSql)
    sql.push('WHERE', whereSql)

  if (query.group || query.groupRaw)
    sql.push('GROUP BY', group(quotedAs, query.group, query.groupRaw))

  if (query.having)
    sql.push('HAVING', having(query.having))

  if (query.window)
    sql.push('WINDOW', window(query.window))

  if (query.union)
    sql.push(await union('UNION', query.union))
  if (query.unionAll)
    sql.push(await union('UNION ALL', query.unionAll))
  if (query.intersect)
    sql.push(await union('INTERSECT', query.intersect))
  if (query.intersectAll)
    sql.push(await union('INTERSECT ALL', query.intersectAll))
  if (query.except)
    sql.push(await union('EXCEPT', query.except))
  if (query.exceptAll)
    sql.push(await union('EXCEPT ALL', query.exceptAll))

  if (query.order || query.orderRaw)
    sql.push('ORDER BY', order(quotedAs, query.order, query.orderRaw))

  if (query.take)
    query.limit = 1

  if (query.limit)
    sql.push(`LIMIT ${query.limit}`)

  if (query.offset)
    sql.push(`OFFSET ${query.offset}`)

  if (query.for)
    sql.push('FOR', query.for)

  return sql.join(' ')
}

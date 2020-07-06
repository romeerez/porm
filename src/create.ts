import {quote} from 'pg-adapter'
import {Model} from './model'

const insert = async <T>(
  model: Model<any>, columns: string[], values: string[][], returning: string | string[], records: T[]
) => {
  const modelColumns = await model.columns()

  const {createdAtColumnName, updatedAtColumnName} = model
  let now: any
  if (modelColumns[createdAtColumnName] || modelColumns[updatedAtColumnName]) {
    now = new Date()
    const quotedNow = quote(now)
    if (modelColumns[createdAtColumnName]) {
      columns.push(`"${createdAtColumnName}"`)
      values.forEach(row => row.push(quotedNow))
    }

    if (modelColumns[updatedAtColumnName]) {
      columns.push(`"${updatedAtColumnName}"`)
      values.forEach(row => row.push(quotedNow))
    }
  }

  if (typeof returning === 'string')
    returning = [returning]

  const result = await model.db.arrays(
    `INSERT INTO ${model.quotedTable} (${
      columns.join(', ')
    }) VALUES ${
      values.map(row => `(${row.join(', ')})`).join(', ')
    } RETURNING ${
      returning.map(c => `"${c}"`).join(', ')
    }`
  ) as any[][]

  result.forEach((row, rowNum) => {
    const record: any = records[rowNum]
    row.forEach((value, i) => {
      record[returning[i]] = value
    })
  })

  if (now) {
    if (modelColumns[createdAtColumnName] && modelColumns[updatedAtColumnName])
      records.forEach((record: any) => record[createdAtColumnName] = record[updatedAtColumnName] = now)
    else if (modelColumns[createdAtColumnName])
      records.forEach((record: any) => record[createdAtColumnName] = now)
    else
      records.forEach((record: any) => record[updatedAtColumnName] = now)
  }

  return records
}

const createMany = <T>(model: Model<any>, records: T[], returning: string | string[]) => {
  const keys: Record<string, true> = {}
  const columns: string[] = []
  const quoted: string[] = []
  records.forEach(record => {
    for (let key in record)
      if (!keys[key]) {
        keys[key] = true
        columns.push(key)
        quoted.push(`"${key}"`)
      }
  })

  const values = records.map((record: any) =>
    columns.map(column =>
      quote(record[column])
    )
  )

  return insert(model, quoted, values, returning, records)
}

const createOne = <T>(model: Model<any>, record: T, returning: string | string[]) =>
  insert(
    model,
    Object.keys(record).map(c => `"${c}"`),
    [Object.values(record).map(v => quote(v))],
    returning,
    [record]
  )

export const create = async <T>(
  model: Model<any>, records: T | T[], returning: string | string[] = model.primaryKey
) => {
  if (Array.isArray(records))
    return await createMany(model, records, returning)
  else
    return (await createOne(model, records, returning))[0]
}

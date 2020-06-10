import {quote} from 'pg-adapter'
import {Model} from './model'

const insert = async <T>(
  model: Model<any>, columns: string[], values: string, returning: string | string[], records: T[]
) => {
  const result = await model.db.arrays(
    `INSERT INTO ${model.quotedTable} (${
      columns.join(', ')
    }) VALUES ${
      values
    } RETURNING ${
      Array.isArray(returning) ? returning.map(c => `"${c}"`).join(', ') : returning
    }`
  ) as any[][]
  result.forEach((row, rowNum) => {
    const record: any = records[rowNum]
    row.forEach((value, i) =>
      record[returning[i]] = value
    )
  })
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
    `(${
      columns.map(column =>
        quote(record[column])
      ).join(', ')
    })`
  )

  return insert(model, quoted, values.join(', '), returning, records)
}

const createOne = <T>(model: Model<any>, record: T, returning: string | string[]) =>
  insert(
    model,
    Object.keys(record).map(c => `"${c}"`),
    `(${Object.values(record).map(v => quote(v)).join(', ')})`,
    returning,
    [record]
  )

export const create = async <T>(
  model: Model<any>, records: T | T[], returning: string | string[] = `"${model.primaryKey}"`
) => {
  if (Array.isArray(records))
    return await createMany(model, records, returning)
  else
    return (await createOne(model, records, returning))[0]
}

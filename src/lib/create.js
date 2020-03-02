const insert = async (model, columns, values, returning, records) => {
  const result = await model.db.arrays(
    `INSERT INTO ${model.quotedTable} (${
      columns.join(', ')
      }) VALUES ${
      values
      } RETURNING ${
      returning.map(c => `"${c}"`).join(', ')
      }`
  )
  result.forEach((row, rowNum) => {
    const record = records[rowNum]
    row.forEach((value, i) =>
      record[columns[i]] = value
    )
  })
  return records
}

const createMany = (model, records, returning) => {
  const {quote} = model.db
  const keys = {}
  const columns = []
  const quoted = []
  records.forEach(record => {
    for (let key in record)
      if (!keys[key]) {
        keys[key] = true
        columns.push(key)
        quoted.push(`"${key}"`)
      }
  })

  const values = records.map(record =>
    `(${
      columns.map(column =>
        quote(record[column])
      ).join(', ')
    })`
  )

  return insert(model, quoted, values.join(', '), returning, records)
}

const create = (model, record, returning) => {
  const {quote} = model.db
  return insert(
    model,
    Object.keys(record).map(c => `"${c}"`),
    `(${Object.values(record).map(v => quote(v)).join(', ')})`,
    returning,
    [record]
  )
}

module.exports = async function(records, returning = ['id']) {
  if (Array.isArray(records))
    return await createMany(this, records, returning)
  else
    return (await create(this, records, returning))[0]
}

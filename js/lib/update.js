exports.update = async function(record, update, returning) {
  const {db, quotedTable, primaryKey} = this
  const id = record[primaryKey]
  if (!id)
    throw new Error(`can not update ${JSON.stringify(record)}: ${primaryKey} missing`)

  const {quote} = db

  const set = []
  for (let key in update)
    set.push(`${quotedTable}."${key}" = ${quote(update[key])}`)

  const [result] = await db.arrays(
    `UPDATE ${
      quotedTable
    } SET ${
      set.join(', ')
    } WHERE ${quotedTable}."${primaryKey}" = ${quote(id)}${
      returning ? returning.map(c => `"${c}"`).join(', ') : ''
    }`
  )
  Object.assign(record, update)

  if (returning)
    returning.forEach((column, i) =>
      record[column] = result[i]
    )

  return record
}

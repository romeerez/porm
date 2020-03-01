exports.delete = function(record) {
  const {quotedTable, primaryKey} = this
  const id = record[primaryKey]
  if (!id)
    throw new Error(`can not delete record without ${primaryKey}`)

  return this.db.exec(
    `DELETE FROM ${quotedTable} WHERE ${quotedTable}."${primaryKey}" = ${id}`
  )
}

const selectObject = (model, list, table, arg, raw, as) => {
  if (arg.__subquery || arg.toQuery) {
    const query = arg.toQuery()
    const sql = query.__query.type ? query.toSql() : query.json().toSql()
    list.push(`(${sql}) AS "${as || query.__query.as || query.model.table}"`)
    return
  }

  for (let key in arg) {
    let value = arg[key]
    if (value.__subquery || typeof value === 'object') {
      if (value.__subquery || value.__query) {
        if (!value.__query || !value.__query.type)
          value = value.json()
        list.push(`(${value.toSql()}) AS "${key}"`)
      } else {
        for (let as in value)
          list.push(`"${key}"."${value[as]}" AS "${as}"`)
      }
    } else if (raw)
      list.push(`${value} AS "${key}"`)
    else
      list.push(`${table}."${value}" AS "${key}"`)
  }
}

const selectString = (model, list, table, arg, raw) => {
  if (raw)
    return list.push(arg)
  else if (arg === undefined && arg === null && arg === false)
    return

  if (model[arg] && model[arg].__subquery)
    selectObject(model, list, table, model[arg], raw, arg)
  else if (arg === '*')
    list.push(`${table}.*`)
  else
    list.push(`${table}."${arg}"`)
}

const select = (model, table, args, raw) => {
  if (!args) return
  const list = []
  args.forEach(arg => {
    if (arg.__subquery || typeof arg === 'object')
      selectObject(model, list, table, arg, raw)
    else
      selectString(model, list, table, arg, raw)
  })
  return list.join(', ')
}

module.exports = select
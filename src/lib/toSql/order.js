const order = (table, args, argsRaw) => {
  const list = []
  if (args)
    args.forEach(arg => {
      if (typeof arg === 'string')
        list.push(`${table}."${arg}"`)
      else
        for (let key in arg) {
          const value = arg[key]
          if (typeof value === 'object') {
            for (let name in value) {
              list.push(`"${key}"."${name}" ${value[name]}`)
            }
          } else {
            list.push(`${table}."${key}" ${arg[key]}`)
          }
        }
    })
  if (argsRaw)
    argsRaw.forEach(arg => {
      list.push(arg)
    })
  return list.join(', ')
}

module.exports = order

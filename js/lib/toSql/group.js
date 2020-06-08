const group = (table, args, argsRaw) => {
  const list = []
  if (args)
    args.forEach(arg => {
      list.push(`${table}."${arg}"`)
    })
  if (argsRaw)
    argsRaw.forEach(arg => {
      list.push(arg)
    })
  return list.join(', ')
}

module.exports = group

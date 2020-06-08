const window = (args) => {
  const list = []
  args.forEach(arg => {
    for (let key in arg)
      list.push(`${key} AS (${arg[key]})`)
  })
  return list.join(', ')
}

module.exports = window

const union = (type, args) => {
  const list = []
  args.forEach(arg => {
    if (typeof arg === 'string')
      list.push(arg)
    else
      list.push(arg.toSql())
  })
  return `${type} ${list.join(` ${type} `)}`
}

module.exports = union

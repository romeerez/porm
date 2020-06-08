const having = (args) => {
  const list = []
  args.forEach(arg => {
    list.push(arg)
  })
  return list.join(', ')
}

module.exports = having

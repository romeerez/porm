export const union = (type: string, args: any[]) => {
  const list: string[] = []
  args.forEach(arg => {
    if (typeof arg === 'string')
      list.push(arg)
    else
      list.push(arg.toSql())
  })
  return `${type} ${list.join(` ${type} `)}`
}

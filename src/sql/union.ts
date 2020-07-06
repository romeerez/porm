export const union = async (type: string, args: any[]) => {
  const list: string[] = []
  await Promise.all(
    args.map(async arg => {
      if (typeof arg === 'string')
        list.push(arg)
      else
        list.push(await arg.toSql())
    })
  )
  return `${type} ${list.join(` ${type} `)}`
}

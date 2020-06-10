export const window = (args: any[]) => {
  const list: string[] = []
  args.forEach(arg => {
    for (let key in arg)
      list.push(`${key} AS (${arg[key]})`)
  })
  return list.join(', ')
}

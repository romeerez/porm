export const group = (table: string, args?: any[], argsRaw?: any[]) => {
  const list: string[] = []
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

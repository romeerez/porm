export const order = (table: string, args?: any[], argsRaw?: any[]) => {
  const list: string[] = []
  if (args)
    args.forEach((arg) => {
      if (typeof arg === 'string') list.push(`${table}."${arg}"`)
      else
        for (const key in arg) {
          const value = arg[key]
          if (typeof value === 'object') {
            for (const name in value) {
              list.push(`"${key}"."${name}" ${value[name]}`)
            }
          } else {
            list.push(`${table}."${key}" ${arg[key]}`)
          }
        }
    })
  if (argsRaw)
    argsRaw.forEach((arg) => {
      list.push(arg)
    })
  return list.join(', ')
}

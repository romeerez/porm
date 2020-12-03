export const window = (args: Record<string, unknown>[]) => {
  const list: string[] = []
  args.forEach((arg) => {
    for (const key in arg) list.push(`${key} AS (${arg[key]})`)
  })
  return list.join(', ')
}

export const having = (args: any[]) => {
  const list: string[] = []
  args.forEach(arg => {
    list.push(arg)
  })
  return list.join(', ')
}

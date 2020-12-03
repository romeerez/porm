import { Model, ModelQuery } from '../model'

const includeRelation = async (
  list: string[],
  model: Model<any>,
  table: string,
  key: string,
  as: string,
  scope?: ModelQuery<any>,
) => {
  const rel = (model as any)[key]
  const query = rel.json(table, scope)
  const sql = await query.toSql()
  list.push(`(${sql}) AS "${as}"`)
}

export const include = async (
  list: string[],
  model: Model<any>,
  table: string,
  args: any[],
) => {
  await Promise.all(
    args.map(async (arg) => {
      if (typeof arg === 'string')
        await includeRelation(list, model, table, arg, arg)
      else if (typeof arg === 'object')
        for (const key in arg) {
          const value = arg[key]
          if (typeof value === 'string')
            await includeRelation(list, model, table, key, value)
          else {
            const as = value.__query?.as || key
            await includeRelation(list, model, table, key, as, value)
          }
        }
    }),
  )
}

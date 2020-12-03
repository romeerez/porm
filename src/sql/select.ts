import { Model } from '../model'

const selectObject = async <T>(
  model: Model<T>,
  list: string[],
  table: string,
  arg: any,
  raw?: boolean,
  as?: string,
) => {
  // if (arg.__subquery || arg.toQuery) {
  //   const query = arg.toQuery()
  //   const sql = await (query.__query.type
  //     ? query.toSql()
  //     : query.json().toSql())
  //   list.push(`(${sql}) AS "${as || query.__query.as || query.model.table}"`)
  //   return
  // }

  for (const key in arg) {
    let value = arg[key]
    if (value.__subquery || typeof value === 'object') {
      if (value.__subquery || value.__query) {
        if (!value.__query || !value.__query.type) value = value.json()
        list.push(`(${await value.toSql()}) AS "${key}"`)
      } else {
        for (const as in value) list.push(`"${key}"."${value[as]}" AS "${as}"`)
      }
    } else if (raw) list.push(`${value} AS "${key}"`)
    else list.push(`${table}."${value}" AS "${key}"`)
  }
}

const selectString = async (
  model: Model<any>,
  list: string[],
  table: string,
  arg: string,
  raw?: boolean,
) => {
  if (raw) return list.push(arg)
  else if (arg === undefined || arg === null || (arg as any) === false) return

  if ((model as any)[arg] && (model as any)[arg].__subquery)
    await selectObject(model, list, table, (model as any)[arg], raw, arg)
  else if (arg === '*') list.push(`${table}.*`)
  else list.push(`${table}."${arg}"`)
}

const selectArgument = async (
  list: string[],
  model: Model<any>,
  table: string,
  arg: any,
  raw?: boolean,
) => {
  if (Array.isArray(arg))
    arg.forEach((item) => selectArgument(list, model, table, item, raw))
  else if (arg.__subquery || typeof arg === 'object')
    await selectObject(model, list, table, arg, raw)
  else await selectString(model, list, table, arg, raw)
}

export const select = async (
  list: string[],
  model: Model<any>,
  table: string,
  args: any[],
  raw?: boolean,
) => {
  await Promise.all(
    args.map((arg) => selectArgument(list, model, table, arg, raw)),
  )
}

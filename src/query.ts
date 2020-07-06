export interface Query
  extends QueryDataArrayAny, QueryDataString, QueryDataStringOrPromise, QueryDataNumber, QueryDataBoolean {}

export interface QueryDataArrayAny {
  and?: any[]
  or?: any[]
  distinct?: any[]
  distinctRaw?: any[]
  select?: any[]
  selectRaw?: any[]
  include?: any[]
  group?: any[]
  groupRaw?: any[]
  having?: any[]
  window?: any[]
  union?: any[]
  unionAll?: any[]
  intersect?: any[]
  intersectAll?: any[]
  except?: any[]
  exceptAll?: any[]
  order?: any[]
  orderRaw?: any[]
  join?: any[]
  prepareArguments?: any[]
}

export interface QueryDataString {
  as?: string
  for?: string
}

export interface QueryDataStringOrPromise {
  from?: string | Promise<string>
}

export interface QueryDataNumber {
  limit?: number
  offset?: number
}

export interface QueryDataBoolean {
  take?: boolean
}

export const createQuery = <T extends object>(model: T, prev?: any) => {
  const object = Object.create(model)
  const query: any = {}
  Object.assign(object, {model, __query: query})
  if (prev)
    for (let key in prev)
      if (Array.isArray(prev[key]))
        query[key] = [...prev[key]]
      else
        query[key] = prev[key]
  return object as T & {model: T, __query: Query}
}

export const merge = <T extends {__query?: Query}>(model: T, args: {__query: any}[]) => {
  const object = model.__query ? model : createQuery(model)
  const target = object.__query as any
  args.forEach(({__query: query}) => {
    if (!query) return

    for (let key in query)
      if (Array.isArray(query[key]))
        target[key] ? target[key].push(...query[key]) : target[key] = query[key]
      else
        target[key] = query[key]
  })
  return object as T & {model: T, __query: Query}
}

export const toQuery = <T extends object>(model: T) => {
  return (
    (model as any).__query ? model : createQuery(model)
  ) as T & {model: T, __query: Query}
}

export const setNumber = <T extends {__query: Query}>(model: {toQuery: () => T}, key: keyof QueryDataNumber, value: number) => {
  const query = model.toQuery()
  query.__query[key] = value
  return query
}

export const setString = <T extends {__query: Query}>(model: {toQuery: () => T}, key: keyof QueryDataString, value: string) => {
  const query = model.toQuery()
  query.__query[key] = value
  return query
}

export const setStringOrPromise = <T extends {__query: Query}>(
  model: {toQuery: () => T}, key: keyof QueryDataStringOrPromise, value: string | Promise<string>
) => {
  const query = model.toQuery()
  query.__query[key] = value
  return query
}

export const setBoolean = <T extends {__query: Query}>(model: {toQuery: () => T}, key: keyof QueryDataBoolean, value: boolean) => {
  const query = model.toQuery()
  query.__query[key] = value
  return query
}

export const pushArrayAny = <T extends {__query: Query}>(model: {toQuery: () => T}, key: keyof QueryDataArrayAny, args: any[]) => {
  const query = model.toQuery()
  const value = query.__query[key]
  value ? value.push(...args) : query.__query[key] = args
  return query
}

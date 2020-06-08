import {QueryData, MQ, QueryDataArrayAny, QueryDataString, QueryDataNumber, QueryDataBoolean} from "../types"

export const createQuery = (model: MQ, prev?: QueryData) => {
  const object = Object.create(model)
  const query: QueryData = {}
  Object.assign(object, {model, __query: query})
  if (prev)
    for (let key in prev)
      if (Array.isArray(prev[key as keyof QueryDataArrayAny]))
        query[key as keyof QueryDataArrayAny] = [...(prev[key as keyof QueryDataArrayAny] as any[])]
      else
        (query as any)[key] = prev[key as keyof QueryData]
  return object
}

export const pushArrayAny = (model: MQ, key: keyof QueryDataArrayAny, args: any[]) => {
  const query = model.toQuery()
  const value = query.__query[key]
  value ? value.push(...args) : query.__query[key] = args
  return query
}

export const setString = (model: MQ, key: keyof QueryDataString, value: string) => {
  const query = model.toQuery()
  query.__query[key] = value
  return query
}

export const setNumber = (model: MQ, key: keyof QueryDataNumber, value: number) => {
  const query = model.toQuery()
  query.__query[key] = value
  return query
}

export const setBoolean = (model: MQ, key: keyof QueryDataBoolean, value: boolean) => {
  const query = model.toQuery()
  query.__query[key] = value
  return query
}

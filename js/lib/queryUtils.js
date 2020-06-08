exports.createQuery = (model, prev) => {
  const object = Object.create(model)
  const query = {}
  Object.assign(object, {model, __query: query})
  if (prev)
    for (let key in prev)
      if (Array.isArray(prev[key]))
        query[key] = [...prev[key]]
      else
        query[key] = prev[key]
  return object
}

exports.cloneMethod = (key) => {
  const modify = `_${key}`
  return function () {
    const query = this.clone()
    return query[modify].apply(query, arguments)
  }
}

exports.pushArgs = (model, key, args) => {
  const query = model.toQuery()
  const q = query.__query
  if (q[key])
    q[key].push(...args)
  else
    q[key] = args
  return query
}

exports.setValue = (model, key, value) => {
  const query = model.toQuery()
  const q = query.__query
  q[key] = value
  return query
}

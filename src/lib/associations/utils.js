exports.init = (fn, through) => {
  fn.association = true
  fn.through = through
  return fn
}

exports.noopScope = q => q

exports.createProxy = (self, query, subquery, take, sourceModel) => {
  query.__subquery = subquery
  query.associationTake = take
  query.sourceModel = sourceModel

  return new Proxy(query, {
    get: (target, name) => name in query ? query[name] : subquery()[name]
  })
}

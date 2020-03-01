const {noopScope, createProxy} = require('./utils')

exports.hasThrough = (self, joinQuery, sourceQuery, scope, take) => {
  if (!scope) scope = noopScope

  let q = sourceQuery
  if (take) q = q.take()
  else q = q.all()

  const query = (record) =>
    scope(q.join(joinQuery(record)))

  const subquery = () =>
    scope(q.join(joinQuery.__subquery()))

  return createProxy(self, query, subquery, take, sourceQuery.sourceModel)
}

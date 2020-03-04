const prototype = {
  call(args, type = this.type) {
    const promise = this.preparedQuery[type](...args)

    if ((type === 'objects' || type === 'arrays') && this.take) {
      return new Promise((resolve, reject) => {
        promise.then((result) => resolve(result[0]), reject)
      })
    }

    return promise
  },

  objects(...args) {
    return this.call(args, 'objects')
  },

  arrays(...args) {
    return this.call(args, 'arrays')
  },

  value(...args) {
    return this.call(args, 'value')
  },

  exec(...args) {
    return this.call(args, 'exec')
  }
}

prototype.query = prototype.objects

exports.prepare = function(name, ...args) {
  const prepared = (...args) => prepared.call(args)
  prepared.preparedQuery = this.db.prepare(name, ...args)(this.toSql())
  prepared.type = this.__query && this.__query.type || 'objects'
  prepared.take = this.__query && this.__query.take || false
  Object.assign(prepared, prototype)
  return prepared
}

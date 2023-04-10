export const Logger = (function({ engine }) {
  const timestamp = {
    toString() {
      return `[${new Date().toLocaleTimeString()}]:`
    }
  }

  function withTime(method) {
    let log = engine[method] ??= console.log
    return log.bind(engine, '%s', timestamp)
  }

  return {
    log: withTime('log'),
    debug: withTime('debug'),
    error: withTime('error')
  }
})({ engine: console })

export function logFunctionArgs(target, method, logger = Logger) {
  return ((originMethod) => {
    return function() {
      logger.log(...arguments)
      return originMethod.apply(this, arguments)
    }
  })(target[method])
}

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
    debug: withTime('debug')
  }
})({ engine: console })



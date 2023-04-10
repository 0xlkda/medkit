class EventBus {
  #eventTarget

  constructor(eventTarget) {
    this.#eventTarget = eventTarget
  }

  getTargetEvent() {
    return this.#eventTarget
  }

  on(type, listener) {
    this.getTargetEvent().addEventListener(type, listener)
    return () => this.off(type, listener)
  }

  once(type, listener) {
    this.getTargetEvent().addEventListener(type, listener, { once: true })
  }

  off(type, listener) {
    this.getTargetEvent().removeEventListener(type, listener)
  }

  emit(type, detail) {
    return this.getTargetEvent().dispatchEvent(new CustomEvent(type, { detail }))
  }

  lazyEmit(type) {
    return (detail) => this.emit(type, detail)
  }
}


function withLog(bus, logger = console, debugMethods = ['emit']) {
  const busWithLog = new Proxy(bus, {
    get(target, prop, receiver) {
      const value = target[prop]

      if (debugMethods.includes(prop)) {
        logger.log(prop)
      }

      if (value instanceof Function) {
        return function(...args) {
          return value.apply(this === receiver ? target : this, args)
        }
      }

      return value
    }
  })

  return busWithLog
}

function createBrowserEventTarget(name) {
  return document.appendChild(document.createComment(name))
}

export function createEventBus(name, env, options = {}) {
  switch (env) {
  case 'browser': {
    const eventTarget = createBrowserEventTarget(name)
    const bus = new EventBus(eventTarget)

    return options.debug
      ? withLog(bus, options.logger, options.debugMethods)
      : bus
  }

  default:
    throw new Error('not implemented')
  }
}

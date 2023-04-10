import { logFunctionArgs } from './logger'

class EventBus {
  #eventTarget

  constructor(eventTarget) {
    this.#eventTarget = eventTarget
  }

  getTargetEvent() {
    return this.#eventTarget
  }

  on(type, listener, options = {}) {
    this.getTargetEvent().addEventListener(type, listener, options)
    return () => {
      this.off(type, listener)
    }
  }

  once(type, listener) {
    this.on(type, listener, { once: true })
  }

  off(type, listener) {
    this.getTargetEvent().removeEventListener(type, listener)
  }

  emit(type, detail) {
    this.getTargetEvent().dispatchEvent(new CustomEvent(type, { detail }))
  }

  lazyEmit(type) {
    return (detail) => this.emit(type, detail)
  }
}

function createBrowserEventTarget(name) {
  return document.appendChild(document.createComment(name))
}

export function createEventBus(name, env, options = {}) {
  switch (env) {
    case 'browser': {
      const eventTarget = createBrowserEventTarget(name)
      const bus = new EventBus(eventTarget)

      if (options.logEmit) {
        bus.emit = logFunctionArgs(bus, 'emit', options.logger)
      }

      return bus
    }

    default:
      throw new Error('not implemented')
  }
}

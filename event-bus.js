import { logFunctionArgs } from './logger'

class EventBus {
  #eventTarget
  #listeners

  constructor(eventTarget) {
    this.#eventTarget = eventTarget
    this.#listeners = []
  }

  on(type, listener, options = {}) {
    const off = () => this.off(type, listener)
    this.#listeners.push(off)
    this.#eventTarget.addEventListener(type, listener, options)
    return off
  }

  once(type, listener) {
    this.on(type, listener, { once: true })
  }

  off(type, listener) {
    if (!type) {
      this.#listeners.forEach(off => off())
    } else {
      this.#eventTarget.removeEventListener(type, listener)
    }
  }

  emit(type, detail) {
    this.#eventTarget.dispatchEvent(new CustomEvent(type, { detail }))
  }

  dispatch(type, detail) {
    return this.emit(type, detail)
  }

  lazyEmit(type) {
    return (detail) => this.emit(type, detail)
  }
}

const eventHubs = new Map()

function createBrowserEventTarget(name) {
  if (eventHubs.has(name)) {
    return eventHubs.get(name)
  }
  const element = eventHubs.set(name, document.createComment(name)).get(name)
  return document.appendChild(element)
}

export function createMessageBus(name, env = 'browser', options = {}) {
  if (env === 'browser') {
    const target = createBrowserEventTarget(name)
    const bus = new EventBus(target)

    if (options.logEmit) {
      bus.emit = logFunctionArgs(bus, 'emit', options.logger)
    }

    return bus
  }

  throw new Error('not implemented')
}

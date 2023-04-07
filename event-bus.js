class EventBus {
  #env
  #eventTarget

  constructor(description, env) {
    this.#env = env
    this.#eventTarget = this.#env.appendChild(this.#env.createComment(description))
  }

  getTargetEvent() {
    return this.#eventTarget
  }

  on(type, listener) {
    this.#eventTarget.addEventListener(type, listener)
    return () => this.off(type, listener)
  }

  once(type, listener) {
    this.#eventTarget.addEventListener(type, listener, { once: true })
  }

  off(type, listener) {
    this.#eventTarget.removeEventListener(type, listener)
  }

  emit(type) {
    return (detail) => this.#eventTarget.dispatchEvent(new CustomEvent(type, { detail }))
  }
}

export function createEventBus(name, env = document) {
  return new EventBus(name, env)
}

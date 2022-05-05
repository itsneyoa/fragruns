export default class Stack<T = string> {
  #array: Array<T> = []
  #size: number

  constructor(size: number) {
    this.#size = size
  }

  add(item: T) {
    this.#array.unshift(item)
    while (this.#array.length > this.#size) {
      this.#array.pop()
    }
    return this.#array
  }

  get stack() {
    return this.#array
  }
}

import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'

class StorageClass {
  static readonly path = join(__dirname, '..', '..', 'store.json')

  readonly allowed: Set<string>
  readonly banned: Set<string>
  apiKey?: string

  constructor() {
    const { allowed = [], banned = [], apiKey = undefined } = existsSync(StorageClass.path) ? (require(StorageClass.path) as Store) : defaultConfig

    this.allowed = new Set(allowed)
    this.banned = new Set(banned)
    this.apiKey = apiKey
  }

  save() {
    writeFileSync(StorageClass.path, JSON.stringify({ allowed: [...this.allowed], banned: [...this.banned], apiKey: this.apiKey } as Store, null, 2))
  }

  isAllowed(username: string) {
    if (this.banned.has(username)) return false // User is banned

    if (this.allowed.size == 0 || this.allowed.has(username)) return true // User is on the allow list or there is no allow list
    return false // Otherwise reject
  }

  allow(username: string) {
    this.banned.delete(username)
    this.allowed.add(username)
  }

  unallow(username: string) {
    this.allowed.delete(username)
  }

  ban(username: string) {
    this.allowed.delete(username)
    this.banned.add(username)
  }

  unban(username: string) {
    this.banned.delete(username)
  }
}

const defaultConfig = {
  allowed: [],
  banned: [],
  apiKey: undefined
}

interface Store {
  allowed: string[]
  banned: string[]
  apiKey: string
}

const Storage = new StorageClass()
export default Storage

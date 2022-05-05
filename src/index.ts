import CreateNextServer from './server'
import Storage from './storage'


CreateNextServer()

const exitEvents = [
  'beforeExit',
  'uncaughtException',
  'unhandledRejection',
  'SIGHUP',
  'SIGINT',
  'SIGQUIT',
  'SIGILL',
  'SIGTRAP',
  'SIGABRT',
  'SIGBUS',
  'SIGFPE',
  'SIGUSR1',
  'SIGSEGV',
  'SIGUSR2',
  'SIGTERM'
]

exitEvents.forEach(event =>
  process.on(event, code => {
    Storage.save()
    process.exit(code)
  })
)

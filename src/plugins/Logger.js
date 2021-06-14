import ulog from 'ulog'

// universal logging utility based on ulog
// tuning hints: https://ulog.js.org/tutorial/
const Logger = ulog('proto-ui')

// setting actual log level
if (process.env.NODE_ENV === 'production') {
  // less verbose for prod
  Logger.level = Logger.WARN
} else {
  // verbose for dev
  Logger.level = Logger.ALL
}

export default Logger

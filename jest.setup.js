const nodeFetch = require('node-fetch')
if (!globalThis.fetch) {
  globalThis.fetch = nodeFetch.default || nodeFetch
  globalThis.Request = nodeFetch.Request
  globalThis.Response = nodeFetch.Response
  globalThis.Headers = nodeFetch.Headers
}

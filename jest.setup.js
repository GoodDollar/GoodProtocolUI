const nodeFetch = require('node-fetch')
const globalObject = typeof globalThis !== 'undefined' ? globalThis : global
if (!globalObject.fetch) {
  globalObject.fetch = nodeFetch.default || nodeFetch
  globalObject.Request = nodeFetch.Request
  globalObject.Response = nodeFetch.Response
  globalObject.Headers = nodeFetch.Headers
}

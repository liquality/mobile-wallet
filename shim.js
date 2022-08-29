if (typeof __dirname === 'undefined') global.__dirname = '/'
if (typeof __filename === 'undefined') global.__filename = ''
if (typeof process === 'undefined') {
  global.process = require('process')
} else {
  const bProcess = require('process')
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p]
    }
  }
}

process.browser = false
if (typeof Buffer === 'undefined') global.Buffer = require('@craftzdog/react-native-buffer').Buffer

const isDev = typeof __DEV__ === 'boolean' && __DEV__
Object.assign(process.env, { NODE_ENV: isDev ? 'development' : 'production' })
if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : ''
}

Promise.allSettled =
  Promise.allSettled ||
  ((promises) =>
    Promise.all(
      promises.map((p) =>
        p
          .then((value) => ({
            status: 'fulfilled',
            value,
          }))
          .catch((reason) => ({
            status: 'rejected',
            reason,
          })),
      ),
    ))

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto
require('crypto')

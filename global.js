// Inject node globals into React Native global scope.
global.Buffer = require('buffer').Buffer
global.process = require('process')

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str, 'binary').toString('base64') // eslint-disable-line
  }
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString('binary') // eslint-disable-line
  }
}

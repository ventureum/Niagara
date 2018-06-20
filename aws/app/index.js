var ipfsAPI = require('./node_modules/ipfs-api')

const COMMAND = 'command'
const CAT = 'cat'
const GET = 'get'
const ADD = 'add'
const IPFSPATH = 'ipfsPath'
const DATA = 'data'

exports.handler = (event, context, callback) => {
  main(event, context, callback)
}

var main = async function (event, context, callback) {
  var ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
  switch (event[COMMAND]) {
    case CAT:
      ipfs.files.cat(event[IPFSPATH], function (err, res) {
        if (err) {
          // eslint-disable-next-line
          callback({
            'statusCode': 500,
            'error': err
          })
        } else {
          callback(null, {
            'statusCode': 200,
            'body': res
          })
        }
      })
      break
    case GET:
      ipfs.files.get(event[IPFSPATH], function (err, res) {
        if (err) {
          // eslint-disable-next-line
          callback({
            'statusCode': 500,
            'error': err
          })
        } else {
          callback(null, {
            'statusCode': 200,
            'body': res
          })
        }
      })
      break
    case ADD:
      ipfs.files.add(Buffer.from(event[DATA].data), function (err, res) {
        if (err) {
          // eslint-disable-next-line
          callback({
            'statusCode': 500,
            'error': err
          })
        } else {
          callback(null, {
            'statusCode': 200,
            'body': res
          })
        }
      })
      break
    default:
      // eslint-disable-next-line
      callback({'statusCode': 500, 'error': 'Invalid Command'})
  }
}

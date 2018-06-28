let stream = require('getstream')

const args = process.argv
const userName = args[2]
console.log('arg:', userName)

const server = stream.connect('6tp7vtdetzcd', 'api_Secret_Key', '38815', { location: 'us-east' })
const publicFeed = server.feed('user', 'public')
const userFeed = server.feed('user', userName)
const userTimelineFeed = server.feed('timeline', userName)

let follows = [
  {'source': `timeline:${userName}`, 'target': `user:${userName}`},
  {'source': `timeline:${userName}`, 'target': `user:public`}
]

server.followMany(follows)

console.log('Public token:', publicFeed.token)
console.log('user token:', userFeed.token)
console.log('timeline token:', userTimelineFeed.token)

// oneHunderPost = async () => {
//   for (let i = 0; i < 50; i++) {
//     await ericFeed.addActivity({
//       "actor": String(this.props.userAddress),
//       "verb": "post",
//       "object": i,
//       "content": {
//         "title": "This is the title of" + String(i),
//         "text": "This is the content of" + String(i),
//         "image" : "https://i.imgur.com/OMheZQZ.jpg",
//         "airdrop": {
//           "address": "Address of a standard airdrop contract",
//           "token": "Address of a standard ERC20 token"
//         }
//       },
//       "to": ["user:public"]
//     })
//   }
// }

// _remove = async (id) => {
//   await ericFeed.removeActivity(id)
// }

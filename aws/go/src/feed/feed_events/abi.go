package feed_events

const PostEventABI string = `[{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "name": "poster",
      "type": "address"
    },
    { 
      "indexed": true,
      "name": "boardId",
      "type": "bytes32"
    },
    {
      "indexed": false,
      "name": "parentHash",
      "type": "bytes32"
    },
    {
      "indexed": true,
      "name": "postHash",
      "type": "bytes32"
    },
    {
      "indexed": false,
      "name": "ipfsPath",
      "type": "bytes32"
    },
    {
      "indexed": false,
      "name": "timestamp",
      "type": "uint256"
    }
  ],
  "name": "Post",
  "type": "event"
}]`

const UpdatePostEventABI  = `[{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "name": "poster",
      "type": "address"
    },
    {
      "indexed": true,
      "name": "postHash",
      "type": "bytes32"
    },
    {
      "indexed": false,
      "name": "ipfsPath",
      "type": "bytes32"
    },
    {
      "indexed": false,
      "name": "timestamp",
      "type": "uint256"
    }
  ],
  "name": "UpdatePost",
  "type": "event"
}]`

const UpvoteEventABI = `[{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "name": "upvoter",
      "type": "address"
    },
    {
      "indexed": true,
      "name": "boardId",
      "type": "bytes32"
    },
    {
      "indexed": true,
      "name": "postHash",
      "type": "bytes32"
    },
    {
      "indexed": false,
      "name": "value",
      "type": "uint256"
    },
    {
      "indexed": false,
      "name": "timestamp",
      "type": "uint256"
    }
  ],
  "name": "Upvote",
  "type": "event"
}]`

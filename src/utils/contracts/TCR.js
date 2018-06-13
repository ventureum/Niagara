const TCR_ABI = [
  {
    'constant': true,
    'inputs': [],
    'name': 'voteStartTime',
    'outputs': [
      {
        'name': '',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'VOTING_LIST',
    'outputs': [
      {
        'name': '',
        'type': 'bytes32'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'VOTE_DURATION',
    'outputs': [
      {
        'name': '',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'MIN_VOTE_THRESHOLD',
    'outputs': [
      {
        'name': '',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'owner',
    'outputs': [
      {
        'name': '',
        'type': 'address'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'PENDING_LIST',
    'outputs': [
      {
        'name': '',
        'type': 'bytes32'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'WHITELIST_LIST',
    'outputs': [
      {
        'name': '',
        'type': 'bytes32'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'newOwner',
        'type': 'address'
      }
    ],
    'name': 'transferOwnership',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'token',
    'outputs': [
      {
        'name': '',
        'type': 'address'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'name': '_token',
        'type': 'address'
      }
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'constructor'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'name': 'voter',
        'type': 'address'
      },
      {
        'indexed': false,
        'name': 'hash',
        'type': 'bytes32'
      },
      {
        'indexed': false,
        'name': 'voteFor',
        'type': 'bool'
      },
      {
        'indexed': false,
        'name': 'value',
        'type': 'uint256'
      }
    ],
    'name': 'Vote',
    'type': 'event'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'name': 'sender',
        'type': 'address'
      },
      {
        'indexed': false,
        'name': 'hash',
        'type': 'bytes32'
      },
      {
        'indexed': false,
        'name': 'success',
        'type': 'bool'
      }
    ],
    'name': 'Whitelist',
    'type': 'event'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'name': 'previousOwner',
        'type': 'address'
      },
      {
        'indexed': true,
        'name': 'newOwner',
        'type': 'address'
      }
    ],
    'name': 'OwnershipTransferred',
    'type': 'event'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'hash',
        'type': 'bytes32'
      }
    ],
    'name': 'addProject',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'hash',
        'type': 'bytes32'
      }
    ],
    'name': 'startPoll',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'voter',
        'type': 'address'
      },
      {
        'name': 'hash',
        'type': 'bytes32'
      },
      {
        'name': 'voteFor',
        'type': 'bool'
      },
      {
        'name': 'value',
        'type': 'uint256'
      }
    ],
    'name': 'vote',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'hash',
        'type': 'bytes32'
      }
    ],
    'name': 'whitelist',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'hash',
        'type': 'bytes32'
      }
    ],
    'name': 'delist',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'hash',
        'type': 'bytes32'
      }
    ],
    'name': 'withdraw',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '_type',
        'type': 'bytes32'
      },
      {
        'name': 'curr',
        'type': 'bytes32'
      }
    ],
    'name': 'getNextProjectHash',
    'outputs': [
      {
        'name': '',
        'type': 'bytes32'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': 'hash',
        'type': 'bytes32'
      }
    ],
    'name': 'voteInProgress',
    'outputs': [
      {
        'name': '',
        'type': 'bool'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': 'hash',
        'type': 'bytes32'
      }
    ],
    'name': 'getPollVotes',
    'outputs': [
      {
        'name': 'voteFor',
        'type': 'uint256'
      },
      {
        'name': 'voteAgainst',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': 'hash',
        'type': 'bytes32'
      },
      {
        'name': 'voter',
        'type': 'address'
      }
    ],
    'name': 'getPollVotesByAddress',
    'outputs': [
      {
        'name': 'voteFor',
        'type': 'uint256'
      },
      {
        'name': 'voteAgainst',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'hash',
        'type': 'bytes32'
      }
    ],
    'name': 'getVoteStartingTimeAndEndingTime',
    'outputs': [
      {
        'name': 'startTime',
        'type': 'uint256'
      },
      {
        'name': 'endTime',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }
]

const TCR_ADDRESS = "0xe6a7265c30b36f87182e96569d7210b5e06b97ff"

export { TCR_ABI, TCR_ADDRESS }

import WalletConnect from '@walletconnect/client'
let connectors = []
let initialized = false
const tempCallIds = []

/* connector.on('disconnect', (error, payload) => {
  if (error) {
    throw error
  }

  // Delete connector
}) */

// Approve Session
/* connector.approveSession({
    accounts: [                 // required
      '0x4292...931B3',
      '0xa4a7...784E8',
      ...
    ],
    chainId: 1     ,             // required
  }) */
// Reject Session
/* connector.rejectSession({
  message: 'OPTIONAL_ERROR_MESSAGE', // optional
})

// Kill Session
connector.killSession()

// Approve Call Request
connector.approveRequest({
  id: 1,
  result: '0x41791102999c339c844880b23950704cc43aa840f3739e365323cda4dfa89e7a',
})

// Reject Call Request
connector.rejectRequest({
  id: 1, // required
  error: {
    code: 'OPTIONAL_ERROR_CODE', // optional
    message: 'OPTIONAL_ERROR_MESSAGE', // optional
  },
}) */

export const walletConnect = async (uri, accountAddress) => {
  const connector = new WalletConnect({
    // Required
    uri,
    // Required
    clientMeta: {
      description: 'WalletConnect Developer App',
      url: 'https://walletconnect.org',
      icons: ['https://walletconnect.org/walletconnect-logo.png'],
      name: 'WalletConnect',
    },
  })

  // Subscribe to session requests
  connector.on('session_request', (error, payload) => {
    console.log(payload, 'PAYLOOOAD', payload.params[0].chainId)
    connector.approveSession({
      accounts: [
        // required
        '0xb81B9B88e764cb6b4E02c5D0F6D6D9051A61E020',
      ],
      chainId: payload.params[0].chainId, // required
    })

    if (error) {
      throw error
    }
  })

  // Subscribe to call requests
  connector.on('call_request', (error, payload) => {
    console.log(payload, 'call req payload')
    //payload should include eth switch network, eth sign transaction/msg
    //call walletcore/chainify to sign/send transaction here

    if (error) {
      throw error
    }
  })
}

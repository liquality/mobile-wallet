import WalletConnect from '@walletconnect/client'
import { sendTransaction } from './store/store'
import { EventEmitter } from 'events'

const hub = new EventEmitter()

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

export const createConnector = async (uri) => {
  console.log(uri, 'wats uri?')
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
  return connector
}

export const initWalletConnect = async (uri, callback) => {
  let connector = await createConnector(uri)

  // Subscribe to session requests
  connector.on('session_request', async (error, payload) => {
    if (error) {
      throw error
    } else {
      console.log(payload, 'wats payload')
      callback({ payload, connector })
    }
  })
}

export const approveWalletConnect = async (
  uri,
  account,
  chainId,
  connector,
  activeNetwork,
) => {
  console.log(uri, account.address, chainId, 'All of the things I need')
  // let connector = await createConnector(uri)

  connector.approveSession({
    accounts: [
      // required
      account.address,
    ],
    chainId, // required
  })

  connector.on('call_request', (error, payload) => {
    console.log(payload, 'call req payload')

    hub.emit('signWalletConnectTransaction', {
      payload,
      createdAt: new Date(),
    })
    console.log(hub, 'wats hub inside WALLETCONNECT')

    let params = {
      activeNetwork,
      asset: 'MATIC',
      fee: payload.params[0].gas,
      feeLabel: 'average',
      memo: payload.params[0].data,
      to: payload.params[0].to,
      value: payload.params[0].value,
    }
    console.log(params, 'params sent in sendtransaction')

    try {
      sendTransaction(params)
    } catch (err) {
      console.log(err, 'error sending TRANSACTION')
    }
    if (error) {
      throw error
    }
  })
}

//OLD ONE
/* function foo(address){
  var returnvalue;    
  geocoder.geocode( { 'address': address}, function(results, status) {
      returnvalue = results[0].geometry.location; 
  })
  return returnvalue; 
}
foo(); //still undefined


function foo(address, fn){
  geocoder.geocode( { 'address': address}, function(results, status) {
     fn(results[0].geometry.location); 
  });
}

foo("address", function(location){
  alert(location); // this is where you get the return value
}); */

export const signWalletConnectTransaction = async (
  connector,
  activeNetwork,
) => {
  // Subscribe to call requests
  //let connector = await createConnector(uri)

  connector.on('call_request', (error, payload) => {
    hub.emit('signWalletConnectTransaction', {
      payload,
      createdAt: new Date(),
    })
    console.log(payload, 'call req payload')
    //payload should include eth switch network, eth sign transaction/msg
    //call walletcore/chainify to sign/send transaction here
    /* 
    let hej = {
      id: 1663594160919539,
      jsonrpc: '2.0',
      method: 'eth_sendTransaction',
      params: [
        {
          data: '0x7ff36ab50000000000000000000000000000000000000000000000000a48faea65305f850000000000000000000000000000000000000000000000000000000000000080000000000000000000000000d8cebecb8a26864812e73a35b59f318890a7696600000000000000000000000000000000000000000000000000000000c650e1f900000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000008f3cf7ad23cd3cadbd9735aff958023239c6a063',
          from: '0xd8cebecb8a26864812e73a35b59f318890a76966',
          gas: '0x4365c',
          to: '0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff',
          value: '0xde0b6b3a7640000',
        },
      ],
    } */
    let params = {
      activeNetwork,
      asset: 'MATIC',
      fee: payload.params[0].gas,
      feeLabel: 'average',
      memo: payload.params[0].data,
      to: payload.params[0].to,
      value: payload.params[0].value,
    }
    console.log(params, 'params sent in sendtransaction')

    try {
      sendTransaction(params)
    } catch (err) {
      console.log(err, 'error sending TRANSACTION')
    }
    if (error) {
      throw error
    }
  })
}

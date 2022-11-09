import WalletConnect from '@walletconnect/client'
import { INJECTION_REQUESTS } from './constants'

import { emitterController } from './emitterController'

/*TODO: Below notes are things that need further investigation/implementation and logic
 ---Method to check if there is an ongoing session, connector.connected() 
should be available to the components so I can display to the user 
 ---Value param is not always sent in from payload, how can I get the transaction details 
 (amount sent/swapped etc) from dapp to component to show the user if walletconnect does not give me it in the payload?
 ---Switch network design needs review, there is currently no screen in figma for this
 ---May be missing some translations
 ---Review Drawer needs styling for SEND transaction, use component as needed
 ---Add custom network/speed fee link and apply that to dapp transaction
 */
const {
  ON_SESSION_REQUEST,
  OFF_SESSION_REQUEST,
  ON_SEND_TRANSACTION,
  OFF_SEND_TRANSACTION,
  ON_SWITCH_CHAIN,
  OFF_SWITCH_CHAIN,
  ON_SIGNED_TYPED_DATA,
  OFF_SIGNED_TYPED_DATA,
} = INJECTION_REQUESTS

export default class WalletConnectController {
  constructor(uri) {
    const connector = new WalletConnect({
      uri,
      clientMeta: {
        description: 'WalletConnect Developer App',
        url: 'https://walletconnect.org',
        icons: ['https://walletconnect.org/walletconnect-logo.png'],
        name: 'WalletConnect',
      },
    })

    connector.on('session_request', (error, payload) => {
      if (error) {
        throw error
      }

      emitterController.emit(ON_SESSION_REQUEST, payload)

      emitterController.on(OFF_SESSION_REQUEST, (address) => {
        if (!address) {
          connector.rejectSession()
        } else {
          connector.approveSession({
            accounts: address,
            chainId: payload.params[0].chainId,
          })
        }
      })
    })

    //TODO: use this bool function 'connector.connected()' to check if session is currently connected
    connector.on('call_request', (error, payload) => {
      if (error) {
        throw error
      }

      const { id: requestId, method } = payload

      switch (method) {
        case 'eth_sendTransaction': {
          emitterController.emit(ON_SEND_TRANSACTION, {
            ...payload,
            chainId: connector.chainId,
          })

          emitterController.on(OFF_SEND_TRANSACTION, (result) => {
            connector.approveRequest({
              id: requestId,
              result,
            })
          })

          break
        }
        case 'eth_signTypedData': {
          emitterController.emit(ON_SIGNED_TYPED_DATA, {
            ...payload,
            chainId: connector.chainId,
          })

          emitterController.on(OFF_SIGNED_TYPED_DATA, (result) => {
            connector.approveRequest({
              id: requestId,
              result,
            })
          })

          break
        }
        case 'wallet_switchEthereumChain': {
          emitterController.emit(ON_SWITCH_CHAIN, {
            ...payload,
            chainId: connector.chainId,
          })

          emitterController.on(OFF_SWITCH_CHAIN, (payload) => {
            connector.approveRequest({
              id: requestId,
              result: null,
            })

            const { address, chainId } = payload

            connector.updateSession({
              chainId: Number(chainId),
              accounts: address,
            })
          })

          break
        }

        default: {
          throw new Error(`Unsupported method: ${method}`)
        }
      }
    })

    connector.on('disconnect', (error, payload) => {
      if (error) {
        throw error
      }

      // Delete connector
    })
  }
}

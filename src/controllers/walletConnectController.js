import WalletConnect from '@walletconnect/client'
import { INJECTION_REQUESTS } from './constants'

import { emitterController } from './emitterController'

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
    console.log(uri, 'URI in NEW walletcontroller ')
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
      console.log('session_request payload: ', payload)

      if (error) {
        throw error
      }

      emitterController.emit(ON_SESSION_REQUEST, payload)

      emitterController.on(OFF_SESSION_REQUEST, (address) => {
        if (!address) {
          connector.rejectSession()
        } else {
          console.log('SESSION APPROVED!')
          connector.approveSession({
            accounts: address,
            chainId: payload.params[0].chainId,
          })
        }
      })
    })

    connector.on('call_request', (error, payload) => {
      console.log('call request payload: ', payload)

      if (error) {
        throw error
      }

      const { id: requestId, method } = payload

      console.log(method, 'METHOD in switch case')

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
            console.log('called: ', OFF_SWITCH_CHAIN)
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

      console.log('disconnect called', payload)
    })
  }
}

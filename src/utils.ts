// To make testing easier for team members
import { InteractionManager } from 'react-native'
import { assets as cryptoassets } from '@liquality/cryptoassets'
import { createWallet } from './store/store'
import { StateType } from './core/types'
import { QuoteType, SwapProvidersEnum } from '@liquality/core/dist/types'
import { MNEMONIC, PASSWORD } from '@env'

export const onOpenSesame = async (dispatch: any, navigation: any) => {
  InteractionManager.runAfterInteractions(() => {
    createWallet(PASSWORD, MNEMONIC)
      .then((walletState) => {
        dispatch({
          type: 'SETUP_WALLET',
          payload: walletState,
        })
      })
      .catch(() => {
        dispatch({
          type: 'ERROR',
          payload: {
            errorMessage: 'Unable to create wallet. Try again!',
          } as StateType,
        })
      })
  }).done(() => {
    navigation.navigate('MainNavigator')
  })
}

export const sortQuotes = (quotes: QuoteType[]): QuoteType[] => {
  if (!quotes) {
    throw new Error('Can not sort a null array')
  }

  if (quotes && quotes.length <= 1) {
    return quotes
  }

  return quotes.slice(0).sort((a, b): number => {
    const isCrossChain = cryptoassets[a.from].chain !== cryptoassets[a.to].chain
    if (isCrossChain) {
      // Prefer Liquality for crosschain swaps where liquidity is available
      if (a.provider === SwapProvidersEnum.LIQUALITY) {
        return -1
      } else if (b.provider === SwapProvidersEnum.LIQUALITY) {
        return 1
      }
    }

    return b.toAmount?.minus(a.toAmount || 0).toNumber() || 1
  })
}

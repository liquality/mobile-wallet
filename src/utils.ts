// To make testing easier for team members
import { InteractionManager } from 'react-native'
import { assets as cryptoassets } from '@liquality/cryptoassets'
import { createWallet } from './store/store'
import {
  QuoteType,
  StateType,
  SwapProvidersEnum,
} from '@liquality/core/dist/types'
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

export const formatDate = (ms: string | number): string => {
  const date = new Date(ms)
  return `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
}

export const capitalizeFirstLetter = (str: string) => {
  if (!str) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

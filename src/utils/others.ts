import { InteractionManager, NativeModules } from 'react-native'
import { assets as cryptoassets } from '@liquality/cryptoassets'
import { AES } from 'crypto-js'
import {
  createWallet,
  fetchFeesForAsset,
  fetchSwapProvider,
} from '../store/store'
import { MNEMONIC, PASSWORD } from '@env'
import { BigNumber } from '@liquality/types'
import { GasFees } from '../types'
import {
  EstimateFeeRequest,
  SwapQuote,
} from '@liquality/wallet-core/dist/swaps/types'
import { Network } from '@liquality/wallet-core/dist/store/types'

// const IV_STRING = '0123456789abcdef0123456789abcdef'

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
          } as any,
        })
      })
  }).done(() => {
    navigation.navigate('MainNavigator')
  })
}

export const sortQuotes = (quotes: SwapQuote[]): SwapQuote[] => {
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
      if (a.provider?.toUpperCase() === 'LIQUALITY') {
        return -1
      } else if (b.provider?.toUpperCase() === 'LIQUALITY') {
        return 1
      }
    }

    return (
      new BigNumber(b.toAmount)
        .minus(new BigNumber(a.toAmount || 0))
        .toNumber() || 1
    )
  })
}

export const formatDate = (ms: string | number): string => {
  const date = new Date(ms)
  return `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
}

export const pbkdf2 = async (
  password: string,
  salt: string,
  iterations: number,
  length: number,
  digest: string,
): Promise<string> => {
  Log(digest, 'info')
  const generatedValue = await NativeModules.Aes.pbkdf2(
    password,
    salt,
    iterations,
    length,
  )

  return global.Buffer.from(generatedValue).toString('hex')
}

export const encrypt = async (
  value: string,
  derivedKey: string,
): Promise<any> => {
  return Promise.resolve(AES.encrypt(value, derivedKey))
  // const encrypted = await NativeModules.Aes.encrypt(
  //   value,
  //   derivedKey,
  //   IV_STRING,
  // )
  // console.log('encrypted: ', encrypted, encrypted0)
  // return encrypted
}

export const decrypt = async (
  encrypted: string,
  derivedKey: string,
): Promise<any> => {
  try {
    return Promise.resolve(AES.decrypt(encrypted, derivedKey))
    // return await NativeModules.Aes.decrypt(encrypted, derivedKey, IV_STRING)
  } catch (e) {
    return ''
  }
}

//TODO This is only a placeholder until we implement a more sophisticated approach to collect logs
const logDump: Record<string, string[]> = {
  info: [],
  warn: [],
  error: [],
}

export const Log = (
  message: unknown,
  level: 'info' | 'warn' | 'error',
): void => {
  logDump[level].push(JSON.stringify(message))
}

export const calculateFees = async (
  activeNetwork: Network,
  activeWalletId: string,
  selectedQuote: SwapQuote,
  asset: string,
  max: boolean,
  txSource: 'from' | 'to',
): Promise<GasFees> => {
  if (!selectedQuote) throw new Error('Invalid arguments')
  let fees: GasFees = {
    slow: new BigNumber(0),
    average: new BigNumber(0),
    fast: new BigNumber(0),
    custom: new BigNumber(0),
  }
  const assetFees = await fetchFeesForAsset(asset)
  const swapProvider = fetchSwapProvider(selectedQuote.provider)
  const feePrices = Object.values(assetFees).map((fee: BigNumber) =>
    fee.toNumber(),
  )

  if (!swapProvider?.fromTxType || !swapProvider?.toTxType)
    throw new Error('Failed to fetch a swap provider')

  const params: EstimateFeeRequest<string, SwapQuote> = {
    network: activeNetwork,
    walletId: activeWalletId,
    asset,
    txType:
      txSource === 'from' ? swapProvider.fromTxType : swapProvider.toTxType,
    quote: selectedQuote,
    feePrices,
    max,
  }
  Log(JSON.stringify(params), 'info')
  const totalFees = await swapProvider.estimateFees(params).catch((e: any) => {
    Log(`Failed to calculate totalFees: ${e}`, 'error')
  })
  // {"0":"0","26.171984565000002":"0.00431837745322500033","26.210744674":"0.00432477287121","26.254814469000003":"0.0043320443873850005"}

  if (!totalFees) throw new Error('Failed to calculate totalFees')

  for (const [speed, fee] of Object.entries(assetFees)) {
    //TODO why are we doing this when fees[speed] is always 0
    // fees[speed] = fees[speed].plus(totalFees[feePrice])
    fees = {
      ...fees,
      [speed]: totalFees[fee.toNumber()].plus(fee),
    }
  }

  return fees
}

export const capitalizeFirstLetter = (str: string) => {
  if (!str) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}
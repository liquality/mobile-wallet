/* eslint-disable prettier/prettier */
import { getAsset } from '@liquality/cryptoassets'
import { AES } from 'crypto-js'
import { fetchFeesForAsset, fetchSwapProvider } from '../store/store'
import { BigNumber } from '@liquality/types'
import { GasFees } from '../types'
import {
  EstimateFeeRequest,
  SwapQuote,
} from '@liquality/wallet-core/dist/src/swaps/types'
import {
  Account,
  Network,
  SwapProviderType,
} from '@liquality/wallet-core/dist/src/store/types'
import dayjs from 'dayjs'
import { Buffer } from '@craftzdog/react-native-buffer'
import QuickCrypto from 'react-native-quick-crypto'

import { translate, TxKeyPath } from '../i18n'
import { Images } from '../assets'

export const sortQuotes = (
  network: string,
  quotes: SwapQuote[],
): SwapQuote[] => {
  if (!quotes) {
    throw new Error('Can not sort a null array')
  }

  if (quotes && quotes.length <= 1) {
    return quotes
  }

  return quotes.slice(0).sort((a, b): number => {
    const isCrossChain =
      getAsset(network, a.from).chain !== getAsset(network, a.to).chain
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

export const formatDate = (ms: number): string => {
  return dayjs(ms).format('DD/MM/YYYY, HH:mm a')
}

export const pbkdf2 = async (
  password: string,
  salt: string,
  iterations: number,
  length: number,
  digest: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    QuickCrypto.pbkdf2(
      Buffer.from(password),
      Buffer.from(salt),
      iterations,
      length,
      digest,
      (error, derivedKey) => {
        if (error || !derivedKey) {
          reject(error)
        } else {
          resolve(derivedKey.toString())
        }
      },
    )
  })
}

export const pbkdf2Sync = (
  password: string,
  salt: string,
  iterations: number,
  length: number,
  digest: string,
): string => {
  const derivedKey = QuickCrypto.pbkdf2Sync(
    Buffer.from(password),
    Buffer.from(salt),
    iterations,
    length,
    digest,
  )

  return derivedKey.toString()
}

global.pbkdf2Sync = pbkdf2Sync
export const encrypt = async (
  value: string,
  derivedKey: string,
): Promise<any> => {
  return Promise.resolve(AES.encrypt(value, derivedKey))
}

export const decrypt = async (
  encrypted: string,
  derivedKey: string,
): Promise<any> => {
  try {
    return Promise.resolve(AES.decrypt(encrypted, derivedKey))
  } catch (e) {
    return ''
  }
}

export const Log = (
  _message: unknown,
  _level: 'info' | 'warn' | 'error',
): void => {
  //TODO store this in a db
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
  const swapProvider = fetchSwapProvider(
    selectedQuote.provider as SwapProviderType,
  )
  const feePrices = Object.values(assetFees).map((fee: BigNumber) =>
    fee.toNumber(),
  )

  if (
    (txSource === 'from' && swapProvider?.fromTxType) ||
    (txSource === 'to' && swapProvider?.toTxType)
  ) {
    const params: EstimateFeeRequest<string, SwapQuote> = {
      network: activeNetwork,
      walletId: activeWalletId,
      asset,
      txType:
        (txSource === 'from'
          ? swapProvider.fromTxType
          : swapProvider.toTxType) || '',
      quote: selectedQuote,
      feePrices,
      max,
    }

    const totalFees = await swapProvider
      .estimateFees(params)
      .catch((e: any) => {
        Log(`Failed to calculate totalFees: ${e}`, 'error')
      })

    if (!totalFees) throw new Error('Failed to calculate totalFees')

    for (const [speed, fee] of Object.entries(assetFees)) {
      fees[speed as keyof GasFees] = totalFees[fee.toNumber()].plus(fee)
    }
  } else {
    for (const [speed, fee] of Object.entries(assetFees)) {
      fees[speed as keyof GasFees] = fee
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

export const isNumber = (value: string): boolean => {
  return /^\d+(.\d*)?$/.test(value)
}

export const labelTranslateFn = (value: TxKeyPath) => translate(value)

export const widthInPerFn = (value: number) => {
  return {
    width: `${value}%`,
  }
}

export const checkIfCollectionNameExists = (str: string) => {
  if (!str) {
    return 'Unknown Collection'
  }
  return str
}

export const checkIfDescriptionExists = (str: string) => {
  if (!str) {
    return 'This NFT has no description.'
  }
  return str
}

export const checkImgUrlExists = (imgUrl: string, imgError: string[]) => {

  if (!imgError.includes(imgUrl) && imgUrl) {
    console.log('return URI', imgUrl)
    return { uri: imgUrl }
  } else {
    console.log('IN ELSE THERE WAS ERROR', imgError)
    return Images.nftThumbnail
  }
}


export const calculateNrOfAccsWithNfts = async (accountsData: Account[]) => {
  return accountsData.filter(
    (account: Account) => account.nfts && account.nfts.length > 0,
  ).length
}

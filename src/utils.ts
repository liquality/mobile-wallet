import { InteractionManager, NativeModules } from 'react-native'
import { assets as cryptoassets } from '@liquality/cryptoassets'
import { AES } from 'crypto-js'
import { createWallet } from './store/store'
import { MNEMONIC, PASSWORD } from '@env'

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

export const sortQuotes = (quotes: any[]): any[] => {
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

    return b.toAmount?.minus(a.toAmount || 0).toNumber() || 1
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
  message: string,
  level: 'info' | 'warn' | 'error',
): void => {
  logDump[level].push(message)
}

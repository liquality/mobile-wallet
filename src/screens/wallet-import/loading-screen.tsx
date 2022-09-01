import React from 'react'
import Spinner from '../../components/spinner'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AccountType, RootStackParamList } from '../../types'
import { useEffect } from 'react'
import { createWallet } from '../../store/store'
import { useRecoilCallback, useSetRecoilState } from 'recoil'
import {
  accountInfoStateFamily,
  accountsIdsState,
  addressStateFamily,
  balanceStateFamily,
  networkState,
  walletState,
} from '../../atoms'
import { chains, getChain } from '@liquality/cryptoassets'
import cryptoassets from '@liquality/wallet-core/dist/src/utils/cryptoassets'
import { Alert } from 'react-native'
import { labelTranslateFn } from '../../utils'

type LoadingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LoadingScreen'
>

const LoadingScreen = ({ route, navigation }: LoadingScreenProps) => {
  const setWallet = useSetRecoilState(walletState)
  const setAccountsIds = useSetRecoilState(accountsIdsState)
  const setActiveNetwork = useSetRecoilState(networkState)
  const addAssetBalance = useRecoilCallback(
    ({ set }) =>
      (accountId: string, accountCode: string) => {
        set(balanceStateFamily({ asset: accountCode, assetId: accountId }), 0)
      },
  )

  const addAccount = useRecoilCallback(
    ({ set }) =>
      (accountId: string, account: AccountType) => {
        set(addressStateFamily(accountId), '')
        set(accountInfoStateFamily(accountId), account)
      },
  )

  useEffect(() => {
    createWallet(route.params.password || '', route.params.mnemonic || '').then(
      (wallet) => {
        const { activeNetwork, activeWalletId } = wallet
        const accounts = wallet?.accounts?.[activeWalletId]?.[activeNetwork]
        if (accounts) {
          const accountsIds: { id: string; name: string }[] = []
          accounts.map((account) => {
            console.log(getChain('testnet', account.chain), 'ACCOUNT GET CHAIN')
            const nativeAsset = getChain('testnet', account.chain).nativeAsset
            console.log(nativeAsset, 'wats native ass?')
            accountsIds.push({
              id: account.id,
              name: nativeAsset[0].name,
            })
            const newAccount: AccountType = {
              id: account.id,
              chain: account.chain,
              name: account.name,
              code: nativeAsset[0].code,
              address: account.addresses[0], //TODO why pick only the first address
              color: account.color,
              assets: {},
              balance: 0,
            }

            for (const asset of account.assets) {
              newAccount.assets[asset] = {
                id: asset,
                name: cryptoassets[asset].name,
                code: asset,
                chain: account.chain,
                color: account.color,
                balance: 0,
                assets: {},
              }
              addAssetBalance(account.id, asset)
            }

            addAccount(account.id, newAccount)
          })

          setAccountsIds(accountsIds)
          setActiveNetwork(activeNetwork)
          setWallet(wallet)
          navigation.navigate('CongratulationsScreen')
        } else {
          Alert.alert(labelTranslateFn('loadingScreen.failedImport')!)
        }
      },
    )
  })
  return <Spinner />
}

export default LoadingScreen

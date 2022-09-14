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
  accountsIdsForMainnetState,
  addressStateFamily,
  balanceStateFamily,
} from '../../atoms'
import { getAsset, getChain } from '@liquality/cryptoassets'
import { Alert } from 'react-native'
import { labelTranslateFn } from '../../utils'
import { Network } from '@liquality/cryptoassets/dist/src/types'

type LoadingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LoadingScreen'
>

const LoadingScreen = ({ route, navigation }: LoadingScreenProps) => {
  const setAccountsIds = useSetRecoilState(accountsIdsState)
  const setAccountsIdsForMainnet = useSetRecoilState(accountsIdsForMainnetState)
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
        const { activeWalletId } = wallet
        let supportedNetWorks = [Network.Mainnet, Network.Testnet]

        for (let network of supportedNetWorks) {
          const accounts = wallet?.accounts?.[activeWalletId]?.[network]
          if (accounts) {
            const accountsIds: { id: string; name: string }[] = []
            accounts.map((account) => {
              const nativeAsset = getChain(network, account.chain).nativeAsset
              accountsIds.push({
                id: account.id,
                name: nativeAsset[0].code,
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
                  name: getAsset(network, asset).name,
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

            network === Network.Testnet
              ? setAccountsIds(accountsIds)
              : setAccountsIdsForMainnet(accountsIds)
          } else {
            Alert.alert(labelTranslateFn('loadingScreen.failedImport')!)
            return
          }
          navigation.navigate('CongratulationsScreen')
        }
      },
    )
  })
  return <Spinner />
}

export default LoadingScreen

import React, { FC, useState } from 'react'
import { View, StyleSheet, Dimensions, Alert } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AccountType, RootStackParamList } from '../../types'
import Header from '../header'
import { Box, Text, Button } from '../../theme'
import { createWallet, storageManager } from '../../store/store'
import { MNEMONIC, PASSWORD } from '@env'
import GradientBackground from '../../components/gradient-background'
import { getAsset, getChain } from '@liquality/cryptoassets'
import { useRecoilCallback, useSetRecoilState } from 'recoil'
import {
  accountInfoStateFamily,
  accountsIdsState,
  accountsIdsForMainnetState,
  addressStateFamily,
  balanceStateFamily,
} from '../../atoms'
import { labelTranslateFn } from '../../utils'
import { Network } from '@liquality/cryptoassets/dist/src/types'

type EntryProps = NativeStackScreenProps<RootStackParamList, 'Entry'>

const Entry: FC<EntryProps> = (props): JSX.Element => {
  const { navigation } = props
  const [loading, setLoading] = useState(false)
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

  const handleImportPress = () => navigation.navigate('WalletImportNavigator')

  const handleCreateWalletPress = () =>
    navigation.navigate('TermsScreen', {
      nextScreen: 'SeedPhraseScreen',
    })

  const handleOpenSesamePress = async () => {
    try {
      setLoading(true)
      storageManager.clearAll()
      const wallet = await createWallet(PASSWORD, MNEMONIC)
      const { activeWalletId } = wallet
      let supportedNetworks = [Network.Mainnet, Network.Testnet]
      for (let network of supportedNetworks) {
        const accounts = wallet?.accounts?.[activeWalletId]?.[network]
        const accountsIds: { id: string; name: string }[] = []

        if (accounts) {
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
          setLoading(false)
          Alert.alert(labelTranslateFn('loadingScreen.failedImport')!)
          return
        }
      }
      setLoading(false)
      navigation.navigate('MainNavigator')
    } catch (error) {
      setLoading(false)
      Alert.alert(labelTranslateFn('somethingWentWrong')!)
    }
  }

  return (
    <Box style={styles.container}>
      <GradientBackground
        width={Dimensions.get('screen').width}
        height={Dimensions.get('screen').height}
        isFullPage
      />
      <Header width={135} height={83} style={styles.header} showText={false} />
      <Box flex={0.4} justifyContent="flex-start" alignItems="center">
        <Text variant="slogan1" tx="common.one" />
        <Text variant="slogan2" tx="common.wallet" />
        <Text variant="slogan1" tx="common.all_chains" />
      </Box>
      <Box flex={0.3} width="90%" justifyContent="flex-end">
        <View style={styles.forgotPassword}>
          <Text variant="description" tx="common.forgotPassword" />
          <Text
            variant="description"
            onPress={handleImportPress}
            tx="common.importWithSeedPhrase"
          />
        </View>
        <Button
          type="primary"
          variant="l"
          label={{ tx: 'entryScreen.createNewWallet' }}
          onPress={handleCreateWalletPress}
          isBorderless
          isActive
        />
        <Button
          type="primary"
          variant="l"
          label={{ tx: 'common.openSesame' }}
          onPress={handleOpenSesamePress}
          isLoading={loading}
          isBorderless
          isActive
        />
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    flex: 0.3,
    width: '100%',
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
export default Entry

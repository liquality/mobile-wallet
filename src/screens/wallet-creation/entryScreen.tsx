import React, { FC, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AccountType, RootStackParamList } from '../../types'
import Header from '../header'
import Text from '../../theme/text'
import Button from '../../theme/button'
import Box from '../../theme/box'
import { createWallet } from '../../store/store'
import { MNEMONIC, PASSWORD } from '@env'
import GradientBackground from '../../components/gradient-background'
import { chains } from '@liquality/cryptoassets'
import cryptoassets from '@liquality/wallet-core/dist/utils/cryptoassets'
import { useRecoilCallback, useSetRecoilState } from 'recoil'
import {
  accountInfoStateFamily,
  accountsIdsState,
  networkState,
} from '../../atoms'

type EntryProps = NativeStackScreenProps<RootStackParamList, 'Entry'>

const Entry: FC<EntryProps> = (props): JSX.Element => {
  const { navigation } = props
  const [loading, setLoading] = useState(false)
  const setAccountsIds = useSetRecoilState(accountsIdsState)
  const setActiveNetwork = useSetRecoilState(networkState)
  const addAccount = useRecoilCallback(
    ({ set }) =>
      (accountId: string, account: AccountType) => {
        set(accountInfoStateFamily(accountId), account)
      },
  )

  const handleImportPress = () => navigation.navigate('WalletImportNavigator')

  const handleCreateWalletPress = () =>
    navigation.navigate('TermsScreen', {
      nextScreen: 'SeedPhraseScreen',
    })

  const handleOpenSesamePress = async () => {
    setLoading(true)
    const { accounts, activeWalletId, activeNetwork } = await createWallet(
      PASSWORD,
      MNEMONIC,
    )
    const accountsIds: { id: string; name: string }[] = []
    accounts?.[activeWalletId]?.[activeNetwork].map((account) => {
      const nativeAsset = chains[account.chain].nativeAsset
      accountsIds.push({
        id: account.id,
        name: nativeAsset,
      })
      const newAccount: AccountType = {
        id: account.id,
        chain: account.chain,
        name: account.name,
        code: nativeAsset,
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
      }

      addAccount(account.id, newAccount)
    })

    setAccountsIds(accountsIds)
    setActiveNetwork(activeNetwork)

    setLoading(false)
    navigation.navigate('MainNavigator')
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
        <Text variant="slogan1">one</Text>
        <Text variant="slogan2">wallet</Text>
        <Text variant="slogan1">all chains</Text>
      </Box>
      <Box flex={0.3} width="90%" justifyContent="flex-end">
        <View style={styles.forgotPassword}>
          <Text variant="description">Forgot password? </Text>
          <Text variant="description" onPress={handleImportPress}>
            Import with seed phrase
          </Text>
        </View>
        <Button
          type="primary"
          variant="l"
          label="Create a new Wallet"
          onPress={handleCreateWalletPress}
          isBorderless
          isActive
        />
        <Button
          type="primary"
          variant="l"
          label="Open Sesame"
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
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
export default Entry

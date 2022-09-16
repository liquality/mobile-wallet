import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  AccountType,
  RootStackParamList,
  UseInputStateReturnType,
} from '../../types'
import Header from '../header'
import { createWallet, restoreWallet, storageManager } from '../../store/store'
import { Box, Button, Text } from '../../theme'
import { MNEMONIC, PASSWORD } from '@env'
import GradientBackground from '../../components/gradient-background'
import { getAsset, getChain } from '@liquality/cryptoassets'
import { useRecoilCallback, useSetRecoilState, useRecoilValue } from 'recoil'
import {
  accountInfoStateFamily,
  accountsIdsState,
  accountsIdsForMainnetState,
  addressStateFamily,
  balanceStateFamily,
  networkState,
} from '../../atoms'
import { labelTranslateFn } from '../../utils'
import { Network } from '@liquality/cryptoassets/dist/src/types'

type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LoginScreen'
>
const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const PASSWORD_LENGTH = 8
  const passwordInput = useInputState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setAccountsIds = useSetRecoilState(accountsIdsState)
  const setAccountsIdsForMainnet = useSetRecoilState(accountsIdsForMainnetState)
  const activeNetwork = useRecoilValue(networkState)
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

  const textInputRef = React.useRef<TextInput>(null)

  const onUnlock = async () => {
    if (!passwordInput.value || passwordInput.value.length < PASSWORD_LENGTH) {
      setError(labelTranslateFn('passwordCreationScreen.password8char')!)
    } else {
      try {
        setLoading(true)
        await restoreWallet(passwordInput.value, activeNetwork)
        navigation.navigate('MainNavigator')
      } catch (_error) {
        passwordInput.onChangeText('')
        setError(labelTranslateFn('loginScreen.invalidPassword')!)
        textInputRef.current?.blur()
        setLoading(false)
      }
    }
  }

  const onSesamePress = async () => {
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
    } catch (_err) {
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
      <KeyboardAvoidingView behavior={'position'} style={styles.keyboard}>
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          width={Dimensions.get('window').width}>
          <Header showText={true} />
          <Box flex={0.6} justifyContent="space-around" width="100%">
            <Box alignItems="center">
              <Text variant="slogan1" tx="common.one" />
              <Text variant="slogan2" tx="common.wallet" />
              <Text variant="slogan1" tx="common.all_chains" />
            </Box>

            <View style={styles.inputWrapper}>
              <Text variant="mainInputLabel" tx="loginScreen.password" />
              <TextInput
                style={styles.input}
                onChangeText={passwordInput.onChangeText}
                onFocus={() => setError('')}
                value={passwordInput.value}
                secureTextEntry
                autoCorrect={false}
                returnKeyType="done"
                ref={textInputRef}
              />
            </View>
            {!!error && <Text variant="error">{error}</Text>}
          </Box>
          <Box flex={0.3} width="90%" justifyContent="flex-end">
            <View style={styles.forgotPassword}>
              <Text variant="description" tx="common.forgotPassword" />
              <Text
                variant="description"
                onPress={() => navigation.navigate('WalletImportNavigator')}
                tx="common.importWithSeedPhrase"
              />
            </View>
            <Button
              type="primary"
              variant="l"
              label={{ tx: 'loginScreen.unlock' }}
              isLoading={loading}
              onPress={onUnlock}
              isBorderless
              isActive={!!passwordInput.value}
            />
            <Button
              type="primary"
              variant="l"
              label={{ tx: 'common.openSesame' }}
              isLoading={loading}
              onPress={onSesamePress}
              isBorderless
              isActive={true}
            />
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputWrapper: {
    width: '90%',
    marginHorizontal: 20,
  },
  input: {
    marginTop: 5,
    padding: 10,
    color: '#FFF',
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyboard: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
export default LoginScreen

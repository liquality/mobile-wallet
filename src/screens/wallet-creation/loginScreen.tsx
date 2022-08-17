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
import { createWallet, restoreWallet } from '../../store/store'
import Text from '../../theme/text'
import Button from '../../theme/button'
import Box from '../../theme/box'
import { MNEMONIC, PASSWORD } from '@env'
import GradientBackground from '../../components/gradient-background'
import { chains } from '@liquality/cryptoassets'
import cryptoassets from '@liquality/wallet-core/dist/src/utils/cryptoassets'
import { useRecoilCallback, useSetRecoilState } from 'recoil'
import {
  accountInfoStateFamily,
  accountsIdsState,
  addressStateFamily,
  balanceStateFamily,
  networkState,
} from '../../atoms'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { labelTranslateFn } from '../../utils'

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

  const textInputRef = React.useRef<TextInput>(null)

  const onUnlock = async () => {
    if (!passwordInput.value || passwordInput.value.length < PASSWORD_LENGTH) {
      setError(labelTranslateFn('passwordCreationScreen.password8char')!)
    } else {
      try {
        setLoading(true)
        await restoreWallet(passwordInput.value)
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
      await AsyncStorage.clear()
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
          addAssetBalance(account.id, asset)
        }

        addAccount(account.id, newAccount)
      })

      setAccountsIds(accountsIds)
      setActiveNetwork(activeNetwork)

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

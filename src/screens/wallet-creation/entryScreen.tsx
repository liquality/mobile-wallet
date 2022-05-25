import React, { FC, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import Header from '../header'
import Text from '../../theme/text'
import Button from '../../theme/button'
import Box from '../../theme/box'
import { createWallet } from '../../store/store'
import { MNEMONIC, PASSWORD } from '@env'
import GradientBackground from '../../components/gradient-background'

type EntryProps = NativeStackScreenProps<RootStackParamList, 'Entry'>

const Entry: FC<EntryProps> = (props): JSX.Element => {
  const { navigation } = props
  const [loading, setLoading] = useState(false)

  const handleImportPress = () => navigation.navigate('WalletImportNavigator')

  const handleCreateWalletPress = () =>
    navigation.navigate('TermsScreen', {
      nextScreen: 'SeedPhraseScreen',
    })

  const handleOpenSesamePress = async () => {
    setLoading(true)
    await createWallet(PASSWORD, MNEMONIC)
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

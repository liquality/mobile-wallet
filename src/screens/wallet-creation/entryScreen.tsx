import React, { useState } from 'react'
import { View, StyleSheet, ImageBackground } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../types'
import Header from '../header'
import { useDispatch } from 'react-redux'
import { onOpenSesame } from '../../utils'
import Text from '../../theme/text'
import Button from '../../theme/button'
import Box from '../../theme/box'

type EntryProps = StackScreenProps<RootStackParamList, 'Entry'>

const Entry = ({ navigation }: EntryProps) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/bg/bg.png')}>
      <Header width={135} height={83} style={styles.header} showText={false} />
      <Box flex={0.4} justifyContent="flex-start" alignItems="center">
        <Text variant="slogan1">one</Text>
        <Text variant="slogan2">wallet</Text>
        <Text variant="slogan1">all chains</Text>
      </Box>
      <Box flex={0.3} width="90%" justifyContent="flex-end">
        <View style={styles.forgotPassword}>
          <Text variant="description">Forgot password? </Text>
          <Text
            variant="description"
            onPress={() => navigation.navigate('WalletImportNavigator')}>
            Import with seed phrase
          </Text>
        </View>
        <Button
          type="primary"
          variant="l"
          label="Create a new Wallet"
          onPress={() => navigation.navigate('TermsScreen')}
          isBorderless={true}
          isActive={true}
        />
        <Button
          type="primary"
          variant="l"
          label="Open Sesame"
          onPress={() => {
            setLoading(true)
            onOpenSesame(dispatch, navigation)
          }}
          isLoading={loading}
          isBorderless={true}
          isActive={true}
        />
      </Box>
    </ImageBackground>
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
  actionContainer: {
    flex: 0.3,
    width: '90%',
    justifyContent: 'flex-end',
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
export default Entry

import React from 'react'
import Spinner from '../../components/spinner'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../types'
import { useEffect, useState } from 'react'
import WalletManager from '../../core/walletManager'
import StorageManager from '../../core/storageManager'
import { Alert } from 'react-native'

type LoadingScreenProps = StackScreenProps<RootStackParamList, 'LoadingScreen'>

const LoadingScreen = ({ route, navigation }: LoadingScreenProps) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      const wallet = {
        mnemomnic: route.params.seedPhrase || '',
        imported: true,
      }
      const walletManager = new WalletManager(
        wallet,
        route.params.password || '',
        new StorageManager(),
      )
      walletManager
        .createWallet()
        .catch(() => {
          Alert.alert('Unable to create wallet', 'Please try again')
        })
        .then(() => {
          setVisible(false)
          navigation.navigate('LoginScreen')
        })
    }, 1000)
  })
  return <Spinner loadingText="Importing wallet" visible={visible} />
}

export default LoadingScreen

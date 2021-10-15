import React from 'react'
import Spinner from '../../components/spinner'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../types'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { createWallet } from '../../store'
import { useDispatch } from 'react-redux'

type LoadingScreenProps = StackScreenProps<RootStackParamList, 'LoadingScreen'>

const LoadingScreen = ({ route, navigation }: LoadingScreenProps) => {
  const [visible, setVisible] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    setTimeout(async () => {
      const wallet = {
        mnemomnic: route.params.mnemonic || '',
        imported: route.params.imported || false,
      }

      const { type } = await dispatch(
        createWallet(wallet, route.params.password || ''),
      )
      if (type === 'ERROR') {
        Alert.alert('Unable to create wallet', 'Please try again')
      } else {
        setVisible(false)
        navigation.navigate('CongratulationsScreen')
      }
    }, 1000)
  })
  return <Spinner loadingText="" visible={visible} />
}

export default LoadingScreen

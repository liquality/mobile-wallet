import React from 'react'
import Spinner from '../../components/spinner'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import { useEffect } from 'react'
import { createWallet } from '../../store/store'
import { useSetRecoilState } from 'recoil'
import { walletState } from '../../atoms'

type LoadingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LoadingScreen'
>

const LoadingScreen = ({ route, navigation }: LoadingScreenProps) => {
  const setWallet = useSetRecoilState(walletState)

  useEffect(() => {
    createWallet(route.params.password || '', route.params.mnemonic || '').then(
      (wallet) => {
        setWallet(wallet)
        navigation.navigate('CongratulationsScreen')
      },
    )
  })
  return <Spinner />
}

export default LoadingScreen

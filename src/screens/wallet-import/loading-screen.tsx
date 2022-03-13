import React from 'react'
import Spinner from '../../components/spinner'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../types'
import { useEffect } from 'react'
import { createWallet } from '../../store/store'
import { useDispatch } from 'react-redux'
import { StateType } from '@liquality/core/dist/types'

type LoadingScreenProps = StackScreenProps<RootStackParamList, 'LoadingScreen'>

const LoadingScreen = ({ route, navigation }: LoadingScreenProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    createWallet(route.params.password || '', route.params.mnemonic || '')
      .then((walletState) => {
        dispatch({
          type: 'SETUP_WALLET',
          payload: walletState,
        })
        navigation.navigate('CongratulationsScreen')
      })
      .catch(() => {
        dispatch({
          type: 'ERROR',
          payload: {
            errorMessage: 'Unable to create wallet. Try again!',
          } as StateType,
        })
      })
  })
  return <Spinner />
}

export default LoadingScreen

import React from 'react'
import Spinner from '../../components/spinner'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../types'
import { useEffect, useState } from 'react'
import { createWallet } from '../../store/store'
import { useDispatch } from 'react-redux'
import { StateType } from '@liquality/core/dist/types'

type LoadingScreenProps = StackScreenProps<RootStackParamList, 'LoadingScreen'>

const LoadingScreen = ({ route, navigation }: LoadingScreenProps) => {
  const [visible, setVisible] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    createWallet(route.params.password || '', route.params.mnemonic || '')
      .then((walletState) => {
        dispatch({
          type: 'SETUP_WALLET',
          payload: walletState,
        })
        setVisible(false)
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
  return <Spinner visible={visible} />
}

export default LoadingScreen

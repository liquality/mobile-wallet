import React, { useEffect } from 'react'
import { Dimensions } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import Confetti from '../../components/confetti'
import { Box, Text } from '../../theme'
import GradientBackground from '../../components/gradient-background'
import { CommonActions } from '@react-navigation/native'

type CongratulationsProps = NativeStackScreenProps<
  RootStackParamList,
  'CongratulationsScreen'
>

const CongratulationsScreen = ({ navigation }: CongratulationsProps) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainNavigator' }],
        }),
      )
    }, 3000)
  })

  return (
    <Box flex={1} justifyContent={'space-between'} paddingVertical={'xl'}>
      <GradientBackground
        width={Dimensions.get('screen').width}
        height={Dimensions.get('screen').height}
        isFullPage
      />
      <Confetti />
      <Box
        alignSelf={'center'}
        alignItems={'center'}
        marginTop={'congratsMarginTop'}>
        <Text
          variant={'congratulationsMessage'}
          tx="congratulationsScreen.congrats"
        />
      </Box>
    </Box>
  )
}

export default CongratulationsScreen

import React from 'react'
import { MainStackParamList } from '../../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Box, Text } from '../../../theme'

type Props = NativeStackScreenProps<MainStackParamList, 'WhatNewScreen'>

const WhatNewScreen: React.FC<Props> = () => {
  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingHorizontal={'onboardingPadding'}>
      <Box marginTop={'xl'}>
        <Text>What's New Screen</Text>
      </Box>
    </Box>
  )
}

export default WhatNewScreen

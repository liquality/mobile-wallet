import React, { FC } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { Box, Text } from '../../../theme'

type ScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'AccountDetailScreen'
>

const AccountDetailScreen: FC<ScreenProps> = () => {
  return (
    <Box
      flex={1}
      paddingHorizontal="screenPadding"
      backgroundColor={'mainBackground'}>
      <Text>Account Detail Screen</Text>
    </Box>
  )
}

export default AccountDetailScreen

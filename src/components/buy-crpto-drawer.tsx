import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../types'
import { Box, Text } from '../theme'
import { useHeaderHeight } from '@react-navigation/elements'
import { AppIcons } from '../assets'
import { ScrollView } from 'react-native'
const { BuyModalClose } = AppIcons

type Props = NativeStackScreenProps<MainStackParamList, 'BuyCryptoDrawer'>
const BuyCryptoDrawer = (props: Props) => {
  const { navigation } = props

  const headerHeight = useHeaderHeight()

  return (
    <Box
      flex={1}
      backgroundColor={'semiTransparentGrey'}
      style={{ paddingTop: headerHeight }}>
      <Box marginTop={'xl'} alignItems="flex-end" padding={'screenPadding'}>
        <BuyModalClose />
      </Box>
      <Box
        flex={1}
        backgroundColor="mainBackground"
        style={{ paddingTop: headerHeight / 2 }}
        paddingHorizontal={'screenPadding'}>
        <ScrollView>
          <Text onPress={navigation.goBack}>Buy Crypto</Text>
        </ScrollView>
      </Box>
    </Box>
  )
}

export default BuyCryptoDrawer

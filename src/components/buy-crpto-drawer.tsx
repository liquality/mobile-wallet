import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../types'
import { Box, Text } from '../theme'
import { useHeaderHeight } from '@react-navigation/elements'
import { AppIcons } from '../assets'
import { ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
const { BuyCryptoCloseLight } = AppIcons

type Props = NativeStackScreenProps<MainStackParamList, 'BuyCryptoDrawer'>
const BuyCryptoDrawer = (props: Props) => {
  const { navigation } = props

  const headerHeight = useHeaderHeight()

  const isScrolledUp = () => {}

  return (
    <Box
      flex={1}
      backgroundColor={'semiTransparentGrey'}
      style={{ paddingTop: headerHeight }}>
      <Box marginTop={'xl'} alignItems="flex-end" padding={'screenPadding'}>
        <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
          <BuyCryptoCloseLight />
        </TouchableOpacity>
      </Box>
      <Box
        flex={1}
        backgroundColor="mainBackground"
        style={{ paddingTop: headerHeight / 2 }}
        paddingHorizontal={'screenPadding'}>
        <ScrollView onScroll={isScrolledUp}>
          <Text>Buy Crypto work in progress</Text>
        </ScrollView>
      </Box>
    </Box>
  )
}

export default BuyCryptoDrawer

import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../types'
import { Box, FLEX_1, Text } from '../theme'
import { useHeaderHeight } from '@react-navigation/elements'
import { AppIcons } from '../assets'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
const { BuyCryptoCloseLight } = AppIcons

type Props = NativeStackScreenProps<MainStackParamList, 'BuyCryptoDrawer'>
const BuyCryptoDrawer = (props: Props) => {
  const { navigation, route } = props

  const headerHeight = useHeaderHeight()

  const isScrolledUp = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent

    if (contentOffset.y > headerHeight - 10) {
      navigation.setParams({ isScrolledUp: true })
    }

    if (contentOffset.y + headerHeight - 10 < 0) {
      navigation.setParams({ isScrolledUp: false })
    }
  }

  return (
    <ScrollView
      scrollEventThrottle={400}
      onScroll={isScrolledUp}
      contentContainerStyle={FLEX_1}>
      {!route.params.isScrolledUp ? (
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
            <Text>Buy Crypto work in progress</Text>
          </Box>
        </Box>
      ) : (
        <Box
          flex={1}
          backgroundColor="mainBackground"
          style={{ paddingTop: headerHeight / 2 }}
          paddingHorizontal={'screenPadding'}>
          <Text>Buy Crypto work in progress</Text>
        </Box>
      )}
    </ScrollView>
  )
}

export default BuyCryptoDrawer

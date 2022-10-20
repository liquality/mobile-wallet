import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../types'
import { Box, FLEX_1 } from '../theme'
import { useHeaderHeight } from '@react-navigation/elements'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native'
import BuyCryptoComponent from './buyCryptoComponent'

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
          <BuyCryptoComponent
            token={route.params.token || ''}
            headerHeight={headerHeight}
            isScrolledUp={route.params.isScrolledUp || false}
          />
        </Box>
      ) : (
        <Box flex={1} backgroundColor="mainBackground">
          <BuyCryptoComponent
            token={route.params.token || ''}
            headerHeight={0}
            isScrolledUp={route.params.isScrolledUp}
          />
        </Box>
      )}
    </ScrollView>
  )
}

export default BuyCryptoDrawer

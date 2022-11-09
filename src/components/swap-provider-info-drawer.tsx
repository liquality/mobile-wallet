import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../types'
import { Box } from '../theme'
import { useHeaderHeight } from '@react-navigation/elements'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native'
import { scale } from 'react-native-size-matters'
import { SCREEN_HEIGHT } from '../utils'
import SwapProviderInfoComponent from './swapProviderInfoComponent'

type Props = NativeStackScreenProps<
  MainStackParamList,
  'SwapProviderInfoDrawer'
>
const SwapProviderInfoDrawer = (props: Props) => {
  const { navigation, route } = props

  const headerHeight = useHeaderHeight()

  const isScrolledUpEvent = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const { contentOffset } = event.nativeEvent

    if (contentOffset.y > headerHeight + 50) {
      navigation.setParams({
        screenTitle: route.params.screenTitle,
        isScrolledUp: true,
      })
    }

    if (contentOffset.y + headerHeight < 0) {
      navigation.setParams({
        screenTitle: route.params.screenTitle,
        isScrolledUp: false,
      })
    }
  }

  const { isScrolledUp } = route.params

  return (
    <Box
      flex={1}
      backgroundColor={isScrolledUp ? 'mainBackground' : 'transparent'}>
      <ScrollView
        style={{ height: SCREEN_HEIGHT }}
        scrollEventThrottle={400}
        onScroll={isScrolledUpEvent}
        contentContainerStyle={{
          paddingBottom: scale(20),
        }}>
        <Box flex={1} backgroundColor="mainBackground">
          <SwapProviderInfoComponent
            headerHeight={headerHeight}
            isScrolledUp={isScrolledUp || false}
          />
        </Box>
      </ScrollView>
    </Box>
  )
}

export default SwapProviderInfoDrawer

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
import BuyCryptoComponent from './buyCryptoComponent'
import { scale } from 'react-native-size-matters'
import { SCREEN_HEIGHT } from '../utils'

type Props = NativeStackScreenProps<MainStackParamList, 'BuyCryptoDrawer'>
const BuyCryptoDrawer = (props: Props) => {
  const { navigation, route } = props

  const headerHeight = useHeaderHeight()

  const isScrolledUpEvent = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const { contentOffset } = event.nativeEvent

    if (contentOffset.y > headerHeight - 10) {
      navigation.setParams({
        screenTitle: route.params.screenTitle,
        isScrolledUp: true,
      })
    }

    if (contentOffset.y + headerHeight - 10 < 0) {
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
        {!isScrolledUp ? (
          <Box
            flex={1}
            style={{ paddingTop: headerHeight * 0.8 }}
            backgroundColor="semiTransparentGrey">
            <BuyCryptoComponent
              token={route.params.token || ''}
              headerHeight={headerHeight}
              isScrolledUp={isScrolledUp || false}
              showIntro={route.params.showIntro || false}
            />
          </Box>
        ) : (
          <Box flex={1} backgroundColor="mainBackground">
            <BuyCryptoComponent
              token={route.params.token || ''}
              headerHeight={0}
              isScrolledUp={isScrolledUp}
              showIntro={route.params.showIntro || false}
            />
          </Box>
        )}
      </ScrollView>
    </Box>
  )
}

export default BuyCryptoDrawer

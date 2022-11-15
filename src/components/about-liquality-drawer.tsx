import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'
import { Box, GRADIENT_STYLE, Text, GRADIENT_COLORS } from '../theme'
import { useHeaderHeight } from '@react-navigation/elements'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native'
import { scale } from 'react-native-size-matters'
import LinearGradient from 'react-native-linear-gradient'
import { AppIcons } from '../assets'

const { LogoFull, OneWalletAllChains } = AppIcons

type Props = NativeStackScreenProps<RootStackParamList, 'AboutLiqualityDrawer'>
const AboutLiqualityDrawer = (props: Props) => {
  const { navigation } = props

  const headerHeight = useHeaderHeight()

  const isScrolledUpEvent = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const { contentOffset } = event.nativeEvent

    if (contentOffset.y > headerHeight + 50) {
      navigation.setParams({
        isScrolledUp: true,
      })
    }

    if (contentOffset.y + headerHeight < 0) {
      navigation.setParams({
        isScrolledUp: false,
      })
    }
  }

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      style={[GRADIENT_STYLE, { paddingTop: headerHeight }]}>
      <ScrollView
        scrollEventThrottle={400}
        onScroll={isScrolledUpEvent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: scale(20),
        }}>
        <Box marginTop={'xl'}>
          <LogoFull width={scale(100)} />
        </Box>
        <OneWalletAllChains width={scale(165)} />
        <Text
          variant={'amountMedium'}
          marginTop={'m'}
          tx="swapCryptoExplore"
          color={'white'}
          lineHeight={scale(28)}
        />
      </ScrollView>
    </LinearGradient>
  )
}

export default AboutLiqualityDrawer

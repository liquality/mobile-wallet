import * as React from 'react'
import { Platform } from 'react-native'
import { Text, Card, Box } from '../../../theme'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { FADE_IN_OUT_DURATION, labelTranslateFn } from '../../../utils'

type AtomicSwapPopUpProps = {
  left?: number
  bottom?: number
}

const AtomicSwapPopUp = ({ left = 0, bottom = 0 }: AtomicSwapPopUpProps) => {
  return (
    <Box position={'absolute'} left={left} bottom={bottom}>
      <Animated.View
        key={'atomicSwap'}
        entering={FadeIn.duration(FADE_IN_OUT_DURATION)}
        exiting={FadeOut.duration(FADE_IN_OUT_DURATION)}>
        <Card
          variant={'swapPopup'}
          alignItems={'center'}
          width={180}
          height={100}
          justifyContent={'center'}
          paddingHorizontal="m">
          <Text color="secondaryForeground" fontSize={14}>
            {labelTranslateFn('swapTypesInfo.atomicSwap')}{' '}
            <Text color="tertiaryForeground" fontSize={14}>
              {labelTranslateFn('swapTypesInfo.swapNativeAssets')}
            </Text>
          </Text>
          {Platform.OS === 'ios' && (
            <Box position={'absolute'} left={'40%'} bottom={-5} zIndex={1}>
              <Box flex={1} alignItems="center" justifyContent={'center'}>
                <Card
                  variant={'rightArrowCard'}
                  style={{ transform: [{ rotate: '45deg' }] }}
                />
              </Box>
            </Box>
          )}
        </Card>
      </Animated.View>
    </Box>
  )
}

export default AtomicSwapPopUp

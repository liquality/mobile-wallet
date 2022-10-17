import * as React from 'react'
import { useColorScheme } from 'react-native'
import { Box, Text } from '../../../theme'
import { MainStackParamList } from '../../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { scale } from 'react-native-size-matters'
import { AppIcons } from '../../../assets'
import { useRecoilValue } from 'recoil'
import { themeMode } from '../../../atoms'
import AssetIcon from '../../../components/asset-icon'
import { ChainId } from '@chainify/types'
import { SCREEN_WIDTH } from '../../../utils'

const { SwapDarkRect, SwapLightRect, SwapIconGrey, SwapIconRed } = AppIcons

const svgCardWidth = scale(SCREEN_WIDTH)
const svgCardHeight = scale(120)

type SwapDetailsScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'SwapDetailsScreen'
>

const SwapDetailsScreen = ({}: SwapDetailsScreenProps) => {
  const fromChain = 'bitcoin' as ChainId
  const toChain = 'ethereum' as ChainId

  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  const LowerBgSvg = currentTheme === 'light' ? SwapDarkRect : SwapLightRect

  const UppperBgSvg = currentTheme === 'dark' ? SwapDarkRect : SwapLightRect
  const success = true
  const SwapIcon = success ? SwapIconGrey : SwapIconRed

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingHorizontal="screenPadding">
      <Box alignItems={'center'} marginTop="m">
        <Box
          width={svgCardWidth}
          height={svgCardHeight}
          alignItems="center"
          justifyContent={'center'}>
          <Box
            flexDirection={'row'}
            width={scale(240)}
            justifyContent="space-evenly">
            <Box alignItems={'center'}>
              <AssetIcon chain={fromChain} size={scale(41)} />
              <Text marginTop={'m'} color="textColor" variant={'iconLabel'}>
                BTC
              </Text>
            </Box>
            <Box
              height={scale(65)}
              alignItems="center"
              justifyContent={'center'}>
              <SwapIcon />
            </Box>
            <Box alignItems={'center'}>
              <AssetIcon chain={toChain} size={scale(41)} />
              <Text marginTop={'m'} color="textColor" variant={'iconLabel'}>
                ETH
              </Text>
            </Box>
          </Box>
          <Box position={'absolute'} zIndex={-1}>
            <UppperBgSvg width={svgCardWidth} height={svgCardHeight} />
          </Box>
          <Box position={'absolute'} zIndex={-2} top={scale(5)} left={scale(5)}>
            <LowerBgSvg width={svgCardWidth} height={svgCardHeight} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SwapDetailsScreen

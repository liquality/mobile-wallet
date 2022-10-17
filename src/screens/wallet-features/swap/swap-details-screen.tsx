import * as React from 'react'
import { ScrollView, useColorScheme } from 'react-native'
import { Box, faceliftPalette, Text } from '../../../theme'
import { MainStackParamList } from '../../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { scale } from 'react-native-size-matters'
import { AppIcons } from '../../../assets'
import { useRecoilValue } from 'recoil'
import { themeMode } from '../../../atoms'
import AssetIcon from '../../../components/asset-icon'
import { ChainId } from '@chainify/types'
import { SCREEN_WIDTH } from '../../../utils'
import SwapRow from './swap-row'
import SwapThreeRow from './swap-three-row'
import TransactionTimeline from './transaction-timeline'
import { TouchableOpacity } from 'react-native-gesture-handler'

const {
  SwapDarkRect,
  SwapLightRect,
  SwapIconGrey,
  SwapIconRed,
  CopyIcon,
  SwapRetry,
  SwapSuccess,
  SwapTknIcon,
} = AppIcons

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
      <ScrollView
        contentContainerStyle={{ paddingBottom: scale(30) }}
        showsVerticalScrollIndicator={false}>
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
            <Box
              position={'absolute'}
              zIndex={-2}
              top={scale(5)}
              left={scale(5)}>
              <LowerBgSvg width={svgCardWidth} height={svgCardHeight} />
            </Box>
          </Box>
        </Box>
        <Box
          flexDirection={'row'}
          justifyContent="space-between"
          alignItems={'center'}
          marginTop={'xxl'}>
          <Box flex={0.65}>
            <Text variant={'listText'} color="greyMeta">
              Status
            </Text>
            <Text
              variant={'termsBody'}
              color={success ? 'greyBlack' : 'danger'}>
              {success ? 'Completed' : 'Failed - refunded'}
            </Text>
          </Box>
          {success ? (
            <SwapSuccess />
          ) : (
            <Box
              flex={0.35}
              flexDirection={'row'}
              alignItems="center"
              justifyContent="space-between">
              <Text variant={'h6'} color="link">
                Retry
              </Text>
              <Box
                width={1}
                height={scale(15)}
                backgroundColor="inactiveText"
              />
              <SwapRetry />
            </Box>
          )}
        </Box>
        <Box marginTop={'xl'}>
          <SwapRow title="Initiated" subTitle="4/27/2022, 6:51pm" />
        </Box>
        <Box marginTop={'xl'}>
          <SwapRow title="Completed" subTitle="4/27/2022, 7:51pm" />
        </Box>
        <Box marginTop={'xl'}>
          <SwapThreeRow
            title="Sent"
            subTitle="0.67281, BTC"
            today="$104.59 today"
            then="$112.12 then"
          />
        </Box>
        <Box marginTop={'xl'}>
          <SwapThreeRow
            title="Received"
            subTitle="0.67281, ETH"
            today="$104.59 today"
            then="$112.12 then"
          />
        </Box>
        <Box marginTop={'xl'}>
          <Text variant={'listText'} color="greyMeta">
            Rate
          </Text>
          <Box flexDirection={'row'}>
            <Text variant={'swapSubTitle'} color={'darkGrey'}>
              1 BTC = 19.2939 ETH
            </Text>
            <Box
              alignSelf={'flex-start'}
              width={1}
              marginHorizontal="m"
              height={scale(15)}
              backgroundColor="inactiveText"
            />
            <Box marginRight="s" style={{ marginTop: -scale(2) }}>
              <SwapTknIcon width={20} />
            </Box>
            <Text marginLeft={'s'} variant={'swapSubTitle'} color={'darkGrey'}>
              1 inch
            </Text>
          </Box>
        </Box>
        <Box marginTop={'xl'}>
          <Text variant={'listText'} color="greyMeta">
            Network Speed/Fee
          </Text>
          <Box flexDirection={'row'}>
            <Text variant={'swapSubTitle'} color={'darkGrey'}>
              Avg 0.014446 BTC
            </Text>
            <Box
              alignSelf={'flex-start'}
              width={1}
              marginHorizontal="m"
              height={scale(15)}
              backgroundColor="inactiveText"
            />
            <Text marginLeft={'s'} variant={'swapSubTitle'} color={'darkGrey'}>
              $ 0.02
            </Text>
          </Box>
        </Box>
        <Box marginTop={'xl'}>
          <TransactionTimeline
            startDate="4/27/2022, 6:51pm"
            completed="4/27/2022, 7:51pm"
            customComponent={[
              {
                customView: (
                  <Box marginLeft={'xl'}>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Box flexDirection={'row'}>
                        <Text
                          marginRight={'m'}
                          variant={'transLink'}
                          color="link">
                          BTC Approved
                        </Text>
                        <CopyIcon stroke={faceliftPalette.linkTextColor} />
                      </Box>
                    </TouchableOpacity>
                    <Text variant={'subListText'} color="darkGrey">
                      Fee: 0.007446 MATIC / ~ $0.01
                    </Text>
                    <Text variant={'subListText'} color="darkGrey">
                      {'Confirmation {00}'}
                    </Text>
                  </Box>
                ),
              },
              {
                customView: (
                  <Box marginLeft={'xl'}>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Box flexDirection={'row'}>
                        <Text
                          marginRight={'m'}
                          variant={'transLink'}
                          color="link">
                          Swap BTC for ETH
                        </Text>
                        <CopyIcon stroke={faceliftPalette.linkTextColor} />
                      </Box>
                    </TouchableOpacity>
                    <Text variant={'subListText'} color="darkGrey">
                      Fee: 0.007446 MATIC / ~ $0.01
                    </Text>
                    <Text variant={'subListText'} color="darkGrey">
                      {'Confirmation {00}'}
                    </Text>
                  </Box>
                ),
              },
            ]}
          />
        </Box>
      </ScrollView>
    </Box>
  )
}

export default SwapDetailsScreen

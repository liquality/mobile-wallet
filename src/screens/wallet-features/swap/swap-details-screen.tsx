import * as React from 'react'
import { ScrollView, useColorScheme } from 'react-native'
import { Box, faceliftPalette, Pressable, Text } from '../../../theme'
import { MainStackParamList } from '../../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { scale } from 'react-native-size-matters'
import { AppIcons } from '../../../assets'
import { useRecoilValue } from 'recoil'
import { themeMode } from '../../../atoms'
import AssetIcon from '../../../components/asset-icon'
import { ChainId } from '@chainify/types'
import { labelTranslateFn, SCREEN_WIDTH } from '../../../utils'
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
  ChevronUp,
  ChevronDown,
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

  const [showDetails, setShowDetails] = React.useState(false)

  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  const LowerBgSvg = currentTheme === 'light' ? SwapDarkRect : SwapLightRect

  const UppperBgSvg = currentTheme === 'dark' ? SwapDarkRect : SwapLightRect
  const success = true
  const SwapIcon = success ? SwapIconGrey : SwapIconRed

  const DynamicIcon = showDetails ? ChevronUp : ChevronDown

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
        <Box marginTop={'xxl'}>
          <Text variant={'listText'} color="greyMeta">
            Status
          </Text>
          <Box
            flexDirection={'row'}
            justifyContent="space-between"
            alignItems={'center'}>
            <Box flex={0.65}>
              <Text
                variant={'termsBody'}
                color={success ? 'greyBlack' : 'danger'}>
                {success ? 'Completed' : 'Failed - refunded'}
              </Text>
            </Box>
            <Box
              flex={0.35}
              flexDirection={'row'}
              alignItems="center"
              justifyContent="space-between">
              <Text variant={'h6'} color="link">
                {success ? 'Link' : 'Retry'}
              </Text>
              <Box
                width={1}
                height={scale(15)}
                backgroundColor="inactiveText"
              />
              {success ? <SwapSuccess /> : <SwapRetry />}
            </Box>
          </Box>
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
          <Box
            flexDirection={'row'}
            justifyContent="space-between"
            alignItems={'center'}>
            <Box flexDirection={'row'} alignItems={'center'}>
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
              <Text
                marginLeft={'s'}
                variant={'swapSubTitle'}
                color={'darkGrey'}>
                $ 0.02
              </Text>
            </Box>
            <Text variant={'speedUp'} color={'link'} tx="common.speedUp" />
          </Box>
        </Box>
        <Box marginTop={'xl'}>
          <TransactionTimeline
            startDate="4/27/2022, 6:51pm"
            completed="4/27/2022, 7:51pm"
            transBtnLabel={labelTranslateFn('swapConfirmationScreen.retry')!}
            tranBtnPress={() => {}}
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
        <Box
          flexDirection={'row'}
          marginTop="xl"
          justifyContent="space-between"
          alignItems={'center'}>
          <Text
            variant={'listText'}
            color="greyBlack"
            tx="swapConfirmationScreen.actions"
          />
          <Pressable
            label={{ tx: 'optionTbd' }}
            style={{
              width: scale(100),
              height: scale(40),
              paddingHorizontal: scale(10),
            }}
            variant={'defaultOutline'}
            onPress={() => {}}
          />
        </Box>
        <Box
          flexDirection={'row'}
          marginTop="xl"
          justifyContent="space-between"
          borderBottomWidth={1}
          borderBottomColor={'greyBlack'}
          paddingBottom="m"
          alignItems={'center'}>
          <Text
            variant={'listText'}
            color="greyBlack"
            tx="swapConfirmationScreen.advanced"
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowDetails((prev) => !prev)}>
            <DynamicIcon width={scale(15)} height={scale(15)} />
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </Box>
  )
}

export default SwapDetailsScreen

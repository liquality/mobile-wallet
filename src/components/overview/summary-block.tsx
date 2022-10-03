import { FC, useCallback, useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  accountsIdsState,
  swapPairState,
  networkState,
  accountsIdsForMainnetState,
  totalFiatBalanceState,
} from '../../atoms'
import { ActionEnum } from '../../types'
import { Alert, ImageBackground, Platform, ViewStyle } from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Box, Text, Card } from '../../theme'
import * as React from 'react'
import { OverviewProps } from '../../screens/wallet-features/home/overview-screen'
import {
  GRADIENT_BACKGROUND_HEIGHT,
  labelTranslateFn,
  SCREEN_WIDTH,
} from '../../utils'
import { Network } from '@liquality/cryptoassets/dist/src/types'
import { Fonts, Images, AppIcons } from '../../assets'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

const { Exchange: DoubleArrowThick, DownIcon, UpIcon, DollarSign } = AppIcons

//Line height issue with Anek Kannada font
const adjustLineHeight = -30

const ImageBackgroundStyle: ViewStyle = {
  height: 30,
  width: SCREEN_WIDTH / 4.6,
}

type SummaryBlockProps = {
  navigation: OverviewProps['navigation']
}

const SummaryBlock: FC<SummaryBlockProps> = (props) => {
  const { navigation } = props
  const network = useRecoilValue(networkState)
  const accountsIds = useRecoilValue(
    network === Network.Testnet ? accountsIdsState : accountsIdsForMainnetState,
  )
  const totalFiatBalance = useRecoilValue(totalFiatBalanceState)
  const setSwapPair = useSetRecoilState(swapPairState)

  const handleSendBtnPress = useCallback(() => {
    navigation.navigate('AssetChooserScreen', {
      screenTitle: labelTranslateFn('summaryBlockComp.selectAssetSend')!,
      action: ActionEnum.SEND,
    })
  }, [navigation])

  const handleReceiveBtnPress = useCallback(() => {
    navigation.navigate('AssetChooserScreen', {
      screenTitle: labelTranslateFn('summaryBlockComp.selectAssetReceive')!,
      action: ActionEnum.RECEIVE,
    })
  }, [navigation])

  const handleSwapBtnPress = useCallback(() => {
    setSwapPair({})
    navigation.navigate('AssetChooserScreen', {
      screenTitle: labelTranslateFn('summaryBlockComp.selectAssetSwap')!,
      action: ActionEnum.SWAP,
    })
  }, [navigation, setSwapPair])

  const handleBuyPress = () => Alert.alert('Coming soon!')

  const appFeatures = [
    {
      Icon: UpIcon,
      name: labelTranslateFn('summaryBlockComp.send'),
      navigateTo: handleSendBtnPress,
    },
    {
      Icon: DoubleArrowThick,
      name: labelTranslateFn('summaryBlockComp.swap'),
      navigateTo: handleSwapBtnPress,
    },
    {
      Icon: DownIcon,
      name: labelTranslateFn('summaryBlockComp.receive'),
      navigateTo: handleReceiveBtnPress,
    },
    {
      Icon: DollarSign,
      name: labelTranslateFn('summaryBlockComp.buy'),
      navigateTo: handleBuyPress,
    },
  ]

  useEffect(() => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
        critical: true,
      })
    }
    //Android considers push notifications as a normal permission
    //and automatically collects this permission on the first app session
  }, [])

  return (
    <Card
      variant={'summaryCard'}
      height={scale(GRADIENT_BACKGROUND_HEIGHT)}
      paddingHorizontal="xl">
      <Box flex={0.65} justifyContent="center">
        <Text color={'darkGrey'} variant="totalBalance">
          $ {totalFiatBalance}
        </Text>
        <Text
          style={{ marginTop: adjustLineHeight }}
          variant="totalAsset"
          color={'nestedColor'}>
          {accountsIds.length}
          {accountsIds.length === 1
            ? `${labelTranslateFn('summaryBlockComp.asset')}`
            : `${labelTranslateFn('summaryBlockComp.assets')}`}
        </Text>
      </Box>
      <Box flex={0.35}>
        <Box flexDirection={'row'} justifyContent="space-evenly">
          {appFeatures.map((item, index) => (
            <Box key={index} alignItems={'center'}>
              <TouchableWithoutFeedback onPress={item.navigateTo}>
                <ImageBackground
                  style={ImageBackgroundStyle}
                  resizeMode="cover"
                  source={Images.hexoNav}>
                  <Box flex={1} justifyContent="center" alignItems={'center'}>
                    <item.Icon height={scale(14)} />
                  </Box>
                </ImageBackground>
              </TouchableWithoutFeedback>
              <Text marginTop={'m'} style={styles.appFeaturesTextStyle}>
                {item.name}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  )
}

const styles = ScaledSheet.create({
  appFeaturesTextStyle: {
    fontFamily: Fonts.JetBrainsMono,
    fontSize: scale(14),
    fontWeight: '500',
  },
})

export default SummaryBlock

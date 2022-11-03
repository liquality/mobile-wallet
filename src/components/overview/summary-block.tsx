import { FC, useCallback, useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  accountsIdsState,
  swapPairState,
  networkState,
  accountsIdsForMainnetState,
  totalFiatBalanceState,
  totalEnabledAssetsWithBalance,
} from '../../atoms'
import { ActionEnum } from '../../types'
import { ImageBackground, Platform } from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Box, Text, Card, IMAGE_BACKGROUND_STYLE } from '../../theme'
import * as React from 'react'
import { OverviewProps } from '../../screens/wallet-features/home/overview-screen'
import { labelTranslateFn } from '../../utils'
import { Network } from '@liquality/cryptoassets/dist/src/types'
import { Images, AppIcons } from '../../assets'
import { scale } from 'react-native-size-matters'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

const { Exchange: DoubleArrowThick, DownIcon, UpIcon, DollarSign } = AppIcons

type SummaryBlockProps = {
  navigation: OverviewProps['navigation']
}

const SummaryBlock: FC<SummaryBlockProps> = (props) => {
  const { navigation } = props
  const network = useRecoilValue(networkState)
  const accountsIds = useRecoilValue(
    network === Network.Testnet ? accountsIdsState : accountsIdsForMainnetState,
  )
  const totalAssets = useRecoilValue(totalEnabledAssetsWithBalance)
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

  const handleBuyPress = () => {
    const showIntro = Number(totalFiatBalance) <= 0
    navigation.navigate('BuyCryptoDrawer', {
      isScrolledUp: false,
      token: '',
      showIntro,
      screenTitle: labelTranslateFn(
        showIntro ? 'gettingStartedWithCrypto' : 'buyCrypto',
      )!,
    })
  }

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
    <Card variant={'headerCard'} paddingHorizontal="xl" padding={'mxxl'}>
      <Box justifyContent="center" marginBottom={'lxxl'}>
        <Text color={'darkGrey'} variant="totalAsset">
          $ {totalFiatBalance}
        </Text>
        <Text variant="totalAsset" color={'nestedColor'}>
          {totalAssets}
          {accountsIds.length === 1
            ? `${labelTranslateFn('summaryBlockComp.asset')}`
            : `${labelTranslateFn('summaryBlockComp.assets')}`}
        </Text>
      </Box>
      <Box>
        <Box flexDirection={'row'} justifyContent="space-evenly">
          {appFeatures.map((item, index) => (
            <Box key={index} alignItems={'center'}>
              <TouchableWithoutFeedback onPress={item.navigateTo}>
                <ImageBackground
                  style={IMAGE_BACKGROUND_STYLE}
                  resizeMode="cover"
                  source={Images.hexoNav}>
                  <Box flex={1} justifyContent="center" alignItems={'center'}>
                    <item.Icon height={scale(14)} />
                  </Box>
                </ImageBackground>
              </TouchableWithoutFeedback>
              <Text marginTop={'m'} variant="addressLabel" color={'darkGrey'}>
                {item.name}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  )
}

export default SummaryBlock

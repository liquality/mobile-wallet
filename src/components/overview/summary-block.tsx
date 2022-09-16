import { FC, Fragment, useCallback, useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  accountsIdsState,
  swapPairState,
  networkState,
  accountsIdsForMainnetState,
  totalFiatBalanceState,
} from '../../atoms'
import { ActionEnum } from '../../types'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import GradientBackground from '../gradient-background'
import { RoundButton, Box, Text } from '../../theme'
import * as React from 'react'
import { OverviewProps } from '../../screens/wallet-features/home/overview-screen'
import { labelTranslateFn } from '../../utils'
import { Network } from '@liquality/cryptoassets/dist/src/types'
import { Fonts } from '../../assets'

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
    <Box style={styles.overviewBlock}>
      <GradientBackground width={Dimensions.get('screen').width} height={225} />
      <Fragment>
        <View style={styles.totalValueSection}>
          <Text style={styles.totalValue} numberOfLines={1}>
            {totalFiatBalance}
          </Text>
          <Text style={styles.currency}>USD</Text>
        </View>
        <Text style={styles.assets}>
          {accountsIds.length}
          {accountsIds.length === 1
            ? `${labelTranslateFn('summaryBlockComp.asset')}`
            : `${labelTranslateFn('summaryBlockComp.assets')}`}
        </Text>

        <Box flexDirection="row" justifyContent="center" marginTop="l">
          <RoundButton
            onPress={handleSendBtnPress}
            tx="summaryBlockComp.send"
            type="SEND"
            variant="smallPrimary"
          />
          <RoundButton
            onPress={handleSwapBtnPress}
            tx="summaryBlockComp.swap"
            type="SWAP"
            variant="largePrimary"
          />
          <RoundButton
            onPress={handleReceiveBtnPress}
            tx="summaryBlockComp.receive"
            type="RECEIVE"
            variant="smallPrimary"
          />
        </Box>
      </Fragment>
    </Box>
  )
}

const styles = StyleSheet.create({
  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    paddingVertical: 10,
  },
  assets: {
    fontFamily: Fonts.Regular,

    fontSize: 20,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  totalValueSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 15,
  },
  totalValue: {
    color: '#FFFFFF',
    fontFamily: Fonts.Regular,

    fontWeight: '500',
    fontSize: 36,
    marginTop: 15,
    textAlignVertical: 'bottom',
  },
  currency: {
    color: '#FFFFFF',
    fontFamily: Fonts.Regular,

    fontWeight: '500',
    fontSize: 18,
    paddingBottom: 3,
    paddingLeft: 5,
    textAlignVertical: 'bottom',
  },
})

export default SummaryBlock

import React, { useCallback } from 'react'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'
import {
  prettyBalance,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import ActivityFlatList from '../../../components/activity-flat-list'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AccountType, RootStackParamList } from '../../../types'
import { BigNumber } from '@liquality/types'
import RoundButton from '../../../theme/round-button'
import Box from '../../../theme/box'
import Text from '../../../theme/text'
import GradientBackground from '../../../components/gradient-background'
import { useRecoilValue } from 'recoil'
import {
  addressStateFamily,
  balanceStateFamily,
  fiatRatesState,
  swapPairState,
} from '../../../atoms'
import { unitToCurrency, assets as cryptoassets } from '@liquality/cryptoassets'
import I18n from 'i18n-js'
import { labelTranslateFn } from '../../../utils'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'

type AssetScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AssetScreen'
>

const AssetScreen = ({ route, navigation }: AssetScreenProps) => {
  const { id, code }: AccountType = route.params.assetData!
  const swapPair = useRecoilValue(swapPairState)
  const address = useRecoilValue(addressStateFamily(id))
  const balance = useRecoilValue(balanceStateFamily(code))
  const fiatRates = useRecoilValue(fiatRatesState)

  const handleSendPress = useCallback(() => {
    navigation.navigate('SendScreen', {
      assetData: route.params.assetData,
      screenTitle: I18n.t('assetScreen.sendCode', { code }),
    })
  }, [code, navigation, route.params.assetData])

  const handleReceivePress = useCallback(() => {
    navigation.navigate('ReceiveScreen', {
      assetData: route.params.assetData,
      includeBackBtn: true,
      screenTitle: I18n.t('assetScreen.receiveCode', { code }),
    })
  }, [code, navigation, route.params.assetData])

  const handleSwapPress = useCallback(() => {
    navigation.navigate('SwapScreen', {
      swapAssetPair: swapPair,
      screenTitle: labelTranslateFn('assetScreen.swap')!,
    })
  }, [navigation, swapPair])

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <React.Suspense
        fallback={
          <View>
            <Text tx="assetScreen.loadingAsset" />
          </View>
        }>
        <Box style={styles.overviewBlock}>
          <GradientBackground
            width={Dimensions.get('screen').width}
            height={225}
          />
          <Box
            flexDirection="row"
            justifyContent="center"
            alignItems="flex-end">
            <Text style={styles.balanceInUSD}>
              {`$${prettyFiatBalance(
                unitToCurrency(cryptoassets[code], new BigNumber(balance)),
                fiatRates?.[code] || 0,
              )}`}
            </Text>
          </Box>
          <Box
            flexDirection="row"
            justifyContent="center"
            alignItems="flex-end">
            <Text style={styles.balanceInNative} numberOfLines={1}>
              {balance &&
                code &&
                prettyBalance(new BigNumber(balance), code).toString()}
            </Text>
            <Text style={styles.nativeCurrency}>{code}</Text>
          </Box>
          <Text style={styles.address}>
            {!!address && `${shortenAddress(address)}`}
          </Text>
          <Box flexDirection="row" justifyContent="center" marginTop="l">
            <RoundButton
              onPress={handleSendPress}
              tx={'assetScreen.send'}
              type="SEND"
              variant="smallPrimary"
            />
            <RoundButton
              onPress={handleSwapPress}
              tx={'assetScreen.swap'}
              type="SWAP"
              variant="largePrimary"
            />
            <RoundButton
              onPress={handleReceivePress}
              tx={'assetScreen.receive'}
              type="RECEIVE"
              variant="smallPrimary"
            />
          </Box>
        </Box>
        <View style={styles.tabBlack}>
          <Pressable style={[styles.leftHeader, styles.headerFocused]}>
            <Text variant="tabHeader" tx="assetScreen.activity" />
          </Pressable>
        </View>
        <ActivityFlatList selectedAsset={code} />
      </React.Suspense>
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
  balanceInUSD: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
    textAlignVertical: 'bottom',
  },
  balanceInNative: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 36,
    textAlignVertical: 'bottom',
  },
  nativeCurrency: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 18,
    paddingBottom: 3,
    paddingLeft: 5,
    textAlignVertical: 'bottom',
  },
  address: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 20,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tabBlack: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'stretch',
    width: '50%',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
  },
  leftHeader: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerFocused: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
})

export default AssetScreen

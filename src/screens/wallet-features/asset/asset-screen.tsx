import React, { useCallback } from 'react'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'
import {
  formatFiat,
  prettyBalance,
} from '@liquality/wallet-core/dist/utils/coinFormatter'
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
  swapPairState,
} from '../../../atoms'

type AssetScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AssetScreen'
>

const AssetScreen = ({ route, navigation }: AssetScreenProps) => {
  const { id, code, balanceInUSD }: AccountType = route.params.assetData!
  const swapPair = useRecoilValue(swapPairState)
  const address = useRecoilValue(addressStateFamily(id))
  const balance = useRecoilValue(balanceStateFamily(code))

  const handleSendPress = useCallback(() => {
    navigation.navigate('SendScreen', {
      assetData: route.params.assetData,
      screenTitle: `Send ${code}`,
    })
  }, [code, navigation, route.params.assetData])

  const handleReceivePress = useCallback(() => {
    navigation.navigate('ReceiveScreen', {
      assetData: route.params.assetData,
      screenTitle: `Receive ${code}`,
    })
  }, [code, navigation, route.params.assetData])

  const handleSwapPress = useCallback(() => {
    navigation.navigate('SwapScreen', {
      swapAssetPair: swapPair,
      screenTitle: 'Swap',
    })
  }, [navigation, swapPair])

  return (
    <Box flex={1} backgroundColor="mainBackground" borderWidth={1}>
      <Box style={styles.overviewBlock}>
        <GradientBackground
          width={Dimensions.get('screen').width}
          height={225}
        />
        <Box flexDirection="row" justifyContent="center" alignItems="flex-end">
          <Text style={styles.balanceInUSD}>
            {balanceInUSD && formatFiat(new BigNumber(balanceInUSD)).toString()}
          </Text>
        </Box>
        <Box flexDirection="row" justifyContent="center" alignItems="flex-end">
          <Text style={styles.balanceInNative} numberOfLines={1}>
            {balance &&
              code &&
              prettyBalance(new BigNumber(balance), code).toString()}
          </Text>
          <Text style={styles.nativeCurrency}>{code}</Text>
        </Box>
        <Text style={styles.address}>
          {`${address?.substring(0, 4)}...${address?.substring(
            address?.length - 4,
          )}`}
        </Text>
        <Box flexDirection="row" justifyContent="center" marginTop="l">
          <RoundButton
            onPress={handleSendPress}
            label="Send"
            type="SEND"
            variant="smallPrimary"
          />
          <RoundButton
            onPress={handleSwapPress}
            label="Swap"
            type="SWAP"
            variant="largePrimary"
          />
          <RoundButton
            onPress={handleReceivePress}
            label="Receive"
            type="RECEIVE"
            variant="smallPrimary"
          />
        </Box>
      </Box>
      <View style={styles.tabBlack}>
        <Pressable style={[styles.leftHeader, styles.headerFocused]}>
          <Text variant="tabHeader">ACTIVITY</Text>
        </Pressable>
      </View>
      <ActivityFlatList navigate={navigation.navigate} selectedAsset={code} />
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

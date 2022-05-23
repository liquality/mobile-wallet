import React from 'react'
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'
import {
  formatFiat,
  prettyBalance,
} from '@liquality/wallet-core/dist/utils/coinFormatter'
import ActivityFlatList from '../../../components/activity-flat-list'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AssetDataElementType, RootStackParamList } from '../../../types'
import { BigNumber } from '@liquality/types'
import RoundButton from '../../../theme/round-button'
import Box from '../../../theme/box'
import Text from '../../../theme/text'

type AssetScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AssetScreen'
>

const AssetScreen = ({ route, navigation }: AssetScreenProps) => {
  const { code, address, balance, balanceInUSD }: AssetDataElementType =
    route.params.assetData!

  const handleSendPress = () => {
    navigation.navigate('SendScreen', {
      assetData: route.params.assetData,
      screenTitle: `Send ${code}`,
    })
  }

  const handleReceivePress = () => {
    navigation.navigate('ReceiveScreen', {
      assetData: route.params.assetData,
      screenTitle: `Receive ${code}`,
    })
  }

  const handleSwapPress = () => {
    navigation.navigate('SwapScreen', {
      swapAssetPair: route.params.swapAssetPair,
      screenTitle: 'Swap',
    })
  }

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <ImageBackground
        style={styles.overviewBlock}
        source={require('../../../assets/bg/action-block-bg.png')}>
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
      </ImageBackground>
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

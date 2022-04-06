import React from 'react'
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'
import { formatFiat, prettyBalance } from '../../../core/utils/coin-formatter'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import ActivityFlatList from '../../../components/activity-flat-list'
import { faGreaterThan, faArrowDown } from '@fortawesome/pro-light-svg-icons'
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
          <Text style={styles.balanceInUSD}>${formatFiat(balanceInUSD!)}</Text>
        </Box>
        <Box flexDirection="row" justifyContent="center" alignItems="flex-end">
          <Text style={styles.balanceInNative} numberOfLines={1}>
            {prettyBalance(new BigNumber(balance), code!)}
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
      <View style={styles.contentBlock}>
        <ActivityFlatList navigate={navigation.navigate} selectedAsset={code}>
          <View style={styles.activityActionBar}>
            <Pressable style={styles.activityBtns}>
              <FontAwesomeIcon
                size={10}
                icon={faGreaterThan}
                color={'#A8AEB7'}
              />
              <Text style={styles.filterLabel}>Filter</Text>
            </Pressable>
            <Pressable style={styles.activityBtns}>
              <FontAwesomeIcon size={10} icon={faArrowDown} color={'#A8AEB7'} />
              <Text style={styles.exportLabel}>Export</Text>
            </Pressable>
          </View>
        </ActivityFlatList>
      </View>
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
  activityActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
  },
  activityBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    color: '#1D1E21',
    marginLeft: 5,
  },
  exportLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    color: '#646F85',
    marginLeft: 5,
  },
  contentBlock: {
    flex: 0.6,
  },
})

export default AssetScreen

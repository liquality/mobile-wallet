import React from 'react'
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { formatFiat, prettyBalance } from '../../../core/utils/coin-formatter'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import ActivityFlatList from '../../../components/activity-flat-list'
import {
  faGreaterThan,
  faExchange,
  faArrowDown,
  faArrowUp,
} from '@fortawesome/pro-light-svg-icons'
import { StackScreenProps } from '@react-navigation/stack'
import { AssetDataElementType, RootStackParamList } from '../../../types'

type AssetScreenProps = StackScreenProps<RootStackParamList, 'AssetScreen'>

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
    <View style={styles.container}>
      <ImageBackground
        style={styles.overviewBlock}
        source={require('../../../assets/bg/action-block-bg.png')}>
        <View style={styles.balance}>
          <Text style={styles.balanceInUSD}>${formatFiat(balanceInUSD!)}</Text>
        </View>
        <View style={styles.balance}>
          <Text style={styles.balanceInNative} numberOfLines={1}>
            {prettyBalance(balance!, code!)}
          </Text>
          <Text style={styles.nativeCurrency}>{code}</Text>
        </View>
        <Text style={styles.address}>
          {`${address?.substring(0, 4)}...${address?.substring(
            address?.length - 4,
          )}`}
        </Text>
        <View style={styles.btnContainer}>
          <View style={styles.btnWrapper}>
            <Pressable style={styles.btn} onPress={handleSendPress}>
              <FontAwesomeIcon
                icon={faArrowUp}
                color={'#9D4DFA'}
                size={20}
                style={styles.smallIcon}
              />
            </Pressable>
            <Text style={styles.btnText}>Send</Text>
          </View>
          <View style={styles.btnWrapper}>
            <Pressable style={styles.btn} onPress={handleSwapPress}>
              <FontAwesomeIcon
                icon={faExchange}
                size={30}
                color={'#9D4DFA'}
                style={styles.smallIcon}
              />
            </Pressable>
            <Text style={styles.btnText}>Swap</Text>
          </View>
          <View style={styles.btnWrapper}>
            <Pressable style={styles.btn} onPress={handleReceivePress}>
              <FontAwesomeIcon
                icon={faArrowDown}
                size={20}
                color={'#9D4DFA'}
                style={styles.smallIcon}
              />
            </Pressable>
            <Text style={styles.btnText}>Receive</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.tabBlack}>
        <Pressable style={[styles.leftHeader, styles.headerFocused]}>
          <Text style={styles.headerText}>ACTIVITY</Text>
        </Pressable>
      </View>
      <View style={styles.contentBlock}>
        <ActivityFlatList navigate={navigation.navigate}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 1,
    backgroundColor: '#FFFFFF',
  },
  overviewBlock: {
    flex: 0.3,
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  assets: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 20,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  balance: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
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
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 7,
    marginTop: 17,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  btnText: {
    fontFamily: 'Montserrat-Regular',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
    marginTop: 11,
  },
  smallIcon: {
    margin: 15,
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
  rightHeader: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerFocused: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
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

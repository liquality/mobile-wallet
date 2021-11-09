import * as React from 'react'
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faExchange,
  faArrowDown,
  faArrowUp,
} from '@fortawesome/pro-regular-svg-icons'
import { faGreaterThan } from '@fortawesome/pro-light-svg-icons'
import { Fragment, useCallback, useState } from 'react'
import { useWalletState } from '../../hooks'
import { formatFiat } from '../../core/utils/coin-formatter'
import AssetFlatList from '../../components/asset-flat-list'
import ActivityFlatList, {
  ActivityDataElementType,
} from '../../components/activity-flat-list'
import { StackScreenProps } from '@react-navigation/stack'
import { ActionEnum, RootStackParamList, StackPayload } from '../../types'

const activities: Array<ActivityDataElementType> = [
  {
    id: '1',
    transaction: 'BTC to DAI',
    time: '4/28/2020, 3:34pm',
    amount: 0.1234,
    status: 'Locking ETH',
  },
  {
    id: '2',
    transaction: 'BTC to ETH',
    time: '4/28/2020, 3:34pm',
    amount: 0.1234,
    status: 'Locking ETH',
  },
]

type OverviewProps = StackScreenProps<RootStackParamList, 'OverviewScreen'>

const OverviewScreen = ({ navigation }: OverviewProps) => {
  enum ViewKind {
    ASSETS,
    ACTIVITY,
  }
  const [selectedView, setSelectedView] = useState(ViewKind.ASSETS)
  const [activityData] = useState<Array<ActivityDataElementType>>(activities)
  const { assets, assetCount, totalFiatBalance, loading } = useWalletState()

  const handleSendBtnPress = useCallback(() => {
    navigation.navigate('AssetChooserScreen', {
      screenTitle: 'Select asset for Send',
      action: ActionEnum.SEND,
    })
  }, [navigation])

  const handleReceiveBtnPress = useCallback(() => {
    navigation.navigate('AssetChooserScreen', {
      screenTitle: 'Select asset for receive',
      action: ActionEnum.RECEIVE,
    })
  }, [navigation])

  const handleSwapBtnPress = useCallback(() => {
    navigation.navigate('AssetChooserScreen', {
      screenTitle: 'Select asset for swap',
      action: ActionEnum.SWAP,
    })
  }, [navigation])

  const onAssetSelected = useCallback(
    (params: StackPayload) => {
      navigation.navigate('AssetScreen', params)
    },
    [navigation],
  )

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.overviewBlock}
        source={require('../../assets/bg/action-block-bg.png')}>
        {loading && <Text style={styles.loading}>Loading...</Text>}
        {!loading && (
          <Fragment>
            <View style={styles.totalValueSection}>
              <Text style={styles.totalValue} numberOfLines={1}>
                {formatFiat(totalFiatBalance)}
              </Text>
              <Text style={styles.currency}>USD</Text>
            </View>
            <Text style={styles.assets}>
              {assetCount}
              {assetCount === 1 ? ' Asset' : ' Assets'}
            </Text>
            <View style={styles.btnContainer}>
              <View style={styles.btnWrapper}>
                <Pressable style={styles.btn} onPress={handleSendBtnPress}>
                  <FontAwesomeIcon
                    icon={faArrowUp}
                    color={'#FFFFFF'}
                    style={styles.smallIcon}
                  />
                </Pressable>
                <Text style={styles.btnText}>Send</Text>
              </View>
              <View style={styles.btnWrapper}>
                <Pressable
                  style={[styles.btn, styles.swapBtn]}
                  onPress={handleSwapBtnPress}>
                  <FontAwesomeIcon
                    size={30}
                    icon={faExchange}
                    color={'#9D4DFA'}
                    style={styles.smallIcon}
                  />
                </Pressable>
                <Text style={styles.btnText}>Swap</Text>
              </View>
              <View style={styles.btnWrapper}>
                <Pressable style={styles.btn} onPress={handleReceiveBtnPress}>
                  <FontAwesomeIcon
                    icon={faArrowDown}
                    color={'#FFFFFF'}
                    style={styles.smallIcon}
                  />
                </Pressable>
                <Text style={styles.btnText}>Receive</Text>
              </View>
            </View>
          </Fragment>
        )}
      </ImageBackground>
      <View style={styles.tabsBlock}>
        <Pressable
          style={[
            styles.leftHeader,
            selectedView === ViewKind.ASSETS && styles.headerFocused,
          ]}
          onPress={() => setSelectedView(ViewKind.ASSETS)}>
          <Text style={styles.headerText}>ASSET</Text>
        </Pressable>
        <Pressable
          style={[
            styles.rightHeader,
            selectedView === ViewKind.ACTIVITY && styles.headerFocused,
          ]}
          onPress={() => setSelectedView(ViewKind.ACTIVITY)}>
          <Text style={styles.headerText}>ACTIVITY</Text>
        </Pressable>
      </View>
      <View style={styles.contentBlock}>
        {selectedView === ViewKind.ACTIVITY &&
          (assets.length > 0 ? (
            <ActivityFlatList activities={activityData}>
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
                  <FontAwesomeIcon
                    size={10}
                    icon={faArrowDown}
                    color={'#A8AEB7'}
                  />
                  <Text style={styles.exportLabel}>Export</Text>
                </Pressable>
              </View>
            </ActivityFlatList>
          ) : (
            <Text style={styles.noActivityMessageBlock}>
              Once you start using your wallet you will see the activity here.
            </Text>
          ))}

        {selectedView === ViewKind.ASSETS && (
          <AssetFlatList assets={assets} onAssetSelected={onAssetSelected} />
        )}
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
  totalValueSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 15,
  },
  totalValue: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 36,
    marginTop: 15,
    textAlignVertical: 'bottom',
  },
  currency: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 18,
    paddingBottom: 3,
    paddingLeft: 5,
    textAlignVertical: 'bottom',
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
    width: 40,
    height: 40,
    marginHorizontal: 7,
    marginTop: 17,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  swapBtn: {
    backgroundColor: '#FFFFFF',
    width: 57,
    height: 57,
  },
  btnText: {
    fontFamily: 'Montserrat-Regular',
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 13,
    marginTop: 11,
  },
  smallIcon: {
    margin: 15,
  },
  tabsBlock: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'stretch',
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
  noActivityMessageBlock: {
    flex: 0.6,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 14,
    marginHorizontal: 20,
    marginTop: 15,
    lineHeight: 20,
  },
  loading: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 28,
    color: '#FFF',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 15,
    lineHeight: 28,
  },
})

export default OverviewScreen

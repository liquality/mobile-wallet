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
  faArrowDown,
  faArrowUp,
  faExchangeAlt,
  faGreaterThan,
} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks'
import { formatFiat } from '../../core/utils/coinFormatter'
import BigNumber from 'bignumber.js'
import AssetFlatList, {
  DataElementType,
} from '../../components/asset-flat-list'
import ActivityFlatList, {
  ActivityDataElementType,
} from '../../components/activity-flat-list'

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
    transaction: 'BTC to DAI',
    time: '4/28/2020, 3:34pm',
    amount: 0.1234,
    status: 'Locking ETH',
  },
]

const OverviewScreen = () => {
  enum ViewKind {
    ASSETS,
    ACTIVITY,
  }
  const [selectedView, setSelectedView] = useState(ViewKind.ASSETS)
  const [totalFiatBalance, setTotalFiatBalance] = useState<BigNumber>(
    new BigNumber(0),
  )
  const [assetCount, setAssetCount] = useState(0)
  const [data, setData] = useState<Array<DataElementType>>([])
  const [activityData] = useState<Array<ActivityDataElementType>>(activities)

  const { accounts, walletId, activeNetwork, fiatRates } = useAppSelector(
    (state) => ({
      accounts: state.accounts,
      walletId: state.activeWalletId,
      activeNetwork: state.activeNetwork,
      fiatRates: state.fiatRates,
    }),
  )

  const toggleRow = (itemId: string) => {
    setData(
      data.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            showAssets: !item.showAssets,
          }
        } else {
          return item
        }
      }),
    )
  }

  useEffect(() => {
    const accts = accounts?.[walletId!]?.[activeNetwork!]
    if (accts && fiatRates) {
      let totalBalance = 0
      let assetCounter = 0
      let accountData: Array<DataElementType> = []

      for (let account of accts) {
        if (Object.keys(account.balances!).length === 0) {
          continue
        }

        const chainData: DataElementType = {
          id: account.chain,
          name: account.chain,
          address: account.addresses[0], //TODO why pick only the first address
          balance: 0,
          balanceInUSD: 0,
          color: account.color,
          assets: [],
          showAssets: false,
        }
        const { total, assetsData } = Object.keys(account.balances!).reduce(
          (
            acc: { total: number; assetsData: Array<DataElementType> },
            asset: string,
          ) => {
            acc.total = acc.total + account.balances![asset] * fiatRates[asset]
            acc.assetsData.push({
              id: asset,
              name: asset,
              balance: account.balances![asset],
              balanceInUSD: account.balances![asset] * fiatRates[asset],
            })
            return acc
          },
          { total: 0, assetsData: [] },
        )

        totalBalance += total

        assetCounter += Object.keys(account.balances!).reduce(
          (count: number, asset: string) =>
            account.balances![asset] > 0 ? ++count : count,
          0,
        )

        chainData.balance = assetsData.reduce(
          (totalBal: number, assetData: DataElementType): number =>
            totalBal + assetData.balance,
          0,
        ) as number

        chainData.balanceInUSD = assetsData.reduce(
          (totalBal: number, assetData: DataElementType) =>
            totalBal + assetData.balanceInUSD,
          0,
        ) as number

        chainData.assets?.push(...assetsData)
        accountData.push(chainData)
      }
      setTotalFiatBalance(new BigNumber(totalBalance))
      setAssetCount(assetCounter)
      setData(accountData)
    }
  }, [accounts, activeNetwork, walletId, fiatRates])

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.overviewBlock}
        source={require('../../assets/bg/action-block-bg.png')}>
        <View style={styles.totalValueSection}>
          <Text style={styles.totalValue}>
            {formatFiat(totalFiatBalance.dividedBy(100000000000000))}
          </Text>
          <Text style={styles.currency}>USD</Text>
        </View>
        <Text style={styles.assets}>
          {assetCount}
          {assetCount === 1 ? ' Asset' : ' Assets'}
        </Text>
        <View style={styles.btnContainer}>
          <View style={styles.btnWrapper}>
            <Pressable style={styles.btn}>
              <FontAwesomeIcon
                icon={faArrowUp}
                color={'#FFFFFF'}
                style={styles.smallIcon}
              />
            </Pressable>
            <Text style={styles.btnText}>Send</Text>
          </View>
          <View style={styles.btnWrapper}>
            <Pressable style={[styles.btn, styles.swapBtn]}>
              <FontAwesomeIcon
                size={30}
                icon={faExchangeAlt}
                color={'#9D4DFA'}
                style={styles.smallIcon}
              />
            </Pressable>
            <Text style={styles.btnText}>Swap</Text>
          </View>
          <View style={styles.btnWrapper}>
            <Pressable style={styles.btn}>
              <FontAwesomeIcon
                icon={faArrowDown}
                color={'#FFFFFF'}
                style={styles.smallIcon}
              />
            </Pressable>
            <Text style={styles.btnText}>Receive</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.header}>
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
      {selectedView === ViewKind.ACTIVITY && (
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
              <FontAwesomeIcon size={10} icon={faArrowDown} color={'#A8AEB7'} />
              <Text style={styles.exportLabel}>Export</Text>
            </Pressable>
          </View>
        </ActivityFlatList>
      )}

      {selectedView === ViewKind.ASSETS && (
        <AssetFlatList assets={data} toggleRow={toggleRow} />
      )}
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
    flex: 0.5,
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  detailsBlock: {
    flex: 0.5,
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
    marginHorizontal: 17,
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
    fontSize: 17,
    marginTop: 11,
  },
  smallIcon: {
    margin: 15,
  },
  header: {
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
})

export default OverviewScreen

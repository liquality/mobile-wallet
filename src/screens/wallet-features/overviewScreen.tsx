import * as React from 'react'
import {
  FlatList,
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
} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks'
import { formatFiat } from '../../core/utils/coinFormatter'
import BigNumber from 'bignumber.js'

interface AssetType {
  id: string
  name: string
  address: string
  balance: string
  balanceInUSD: string
}

const DATA: Array<AssetType> = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Ethereum',
    address: 'b01992929293839393',
    balance: '0.12345',
    balanceInUSD: '$12.22',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'DAI',
    address: 'b01992929293839393',
    balance: '0.12345',
    balanceInUSD: '$12.22',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    name: 'Bitcoin',
    address: 'b01992929293839393',
    balance: '0.12345',
    balanceInUSD: '$12.22',
  },
]

const renderAsset = ({ item }: { item: AssetType }) => {
  const { name, address, balance, balanceInUSD } = item
  return (
    <View style={[styles.row]}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.address}>{address}</Text>
      </View>
      <View>
        <Text style={styles.balance}>{balance}</Text>
        <Text style={styles.balanceInUSD}>{balanceInUSD}</Text>
      </View>
    </View>
  )
}

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
  const { accounts, walletId, activeNetwork, fiatRates } = useAppSelector(
    (state) => ({
      accounts: state.accounts,
      walletId: state.activeWalletId,
      activeNetwork: state.activeNetwork,
      fiatRates: state.fiatRates,
    }),
  )

  useEffect(() => {
    const accts = accounts?.[walletId!]?.[activeNetwork!]
    if (accts && fiatRates) {
      let totalBalance = 0
      let assetCounter = 0
      for (let account of accts) {
        totalBalance += Object.keys(account.balances!).reduce(
          (total: number, asset: string) =>
            total + account.balances![asset] * fiatRates[asset],
          0,
        )

        assetCounter += Object.keys(account.balances!).reduce(
          (count: number, asset: string) =>
            account.balances![asset] > 0 ? ++count : count,
          0,
        )
      }
      setTotalFiatBalance(new BigNumber(totalBalance))
      setAssetCount(assetCounter)
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
      <FlatList
        contentContainerStyle={styles.detailsBlock}
        data={DATA}
        renderItem={renderAsset}
        keyExtractor={(item) => item.id}
      />
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
  },
  detailsBlock: {
    flex: 0.5,
    marginTop: 15,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
    padding: 10,
  },
  name: {
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    fontSize: 12,
  },
  address: {
    fontFamily: 'Montserrat-Regular',
    color: '#646F85',
    fontSize: 12,
  },
  balance: {
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    fontSize: 13,
  },
  balanceInUSD: {
    fontFamily: 'Montserrat-Regular',
    color: '#646F85',
    fontSize: 12,
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
})

export default OverviewScreen

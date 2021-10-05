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
  faTachometerAlt,
  faGreaterThan,
} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks'
import { formatFiat } from '../../core/utils/coinFormatter'
import BigNumber from 'bignumber.js'
import BTCIcon from '../../assets/icons/crypto/btc.svg'
import ETHIcon from '../../assets/icons/crypto/eth.svg'

const getAssetIcon = (asset: string) => {
  if (asset === 'eth' || asset === 'ethereum') {
    return <ETHIcon width={28} height={28} />
  } else {
    return <BTCIcon width={28} height={28} />
  }
}

type DataElementType = {
  id: string
  name: string
  address?: string
  balance: number
  balanceInUSD: number
  color?: string
  assets?: Array<DataElementType>
  showAssets?: boolean
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
  const [data, setData] = useState<Array<DataElementType>>([])
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

  const renderAsset = ({ item }: { item: DataElementType }) => {
    const { name, address, balance, balanceInUSD } = item
    const isNested = item.assets && item.assets.length > 0

    return (
      <View>
        <View
          style={[
            styles.row,
            { borderLeftColor: item.color, borderLeftWidth: 3 },
          ]}>
          <View style={styles.col1}>
            <Pressable onPress={() => toggleRow(item.id)}>
              <Text style={styles.plusSign}>
                {isNested ? (item.showAssets ? '-' : '+') : ''}
              </Text>
            </Pressable>
            {getAssetIcon(item.name)}
          </View>
          <View style={styles.col2}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.address}>
              {`${address?.substring(0, 4)}...${address?.substring(
                address?.length - 4,
              )}`}
            </Text>
          </View>
          {!isNested && (
            <View style={styles.col3}>
              <Text style={styles.balance}>{balance}</Text>
              <Text style={styles.balanceInUSD}>{balanceInUSD}</Text>
            </View>
          )}
          {!isNested && (
            <View style={styles.col4}>
              <Pressable>
                <FontAwesomeIcon
                  size={20}
                  icon={faGreaterThan}
                  color={'#A8AEB7'}
                />
              </Pressable>
            </View>
          )}
          {isNested && (
            <View style={styles.col3}>
              <Text style={styles.TotalBalanceInUSD}>
                Total {balanceInUSD} USD
              </Text>
              <View style={styles.gas}>
                <FontAwesomeIcon
                  size={20}
                  icon={faTachometerAlt}
                  color={'#9D4DFA'}
                  style={styles.gasIcon}
                />
                <Text style={styles.gasLabel}>Gas</Text>
              </View>
            </View>
          )}
        </View>
        {isNested &&
          item.showAssets &&
          item.assets!.map((subElem) => {
            return (
              <View style={[styles.row, styles.subElement]}>
                <View style={styles.col1}>{getAssetIcon(subElem.name)}</View>
                <View style={styles.col2}>
                  <Text style={styles.name}>{subElem.name}</Text>
                </View>
                <View style={styles.col3}>
                  <Text style={styles.balance}>{subElem.balance}</Text>
                  <Text style={styles.balanceInUSD}>
                    {subElem.balanceInUSD}
                  </Text>
                </View>
                <View style={styles.col4}>
                  <Pressable>
                    <FontAwesomeIcon
                      size={20}
                      icon={faGreaterThan}
                      color={'#A8AEB7'}
                    />
                  </Pressable>
                </View>
              </View>
            )
          })}
      </View>
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
      <FlatList
        contentContainerStyle={styles.detailsBlock}
        data={data}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
    padding: 5,
  },
  col1: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 5,
  },
  col2: {
    flex: 0.2,
    justifyContent: 'center',
  },
  col3: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  col4: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  plusSign: {
    marginRight: 5,
  },
  subElement: {
    paddingLeft: 50,
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
  TotalBalanceInUSD: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
  },
  gasLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#646F85',
  },
  gas: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  gasIcon: {
    marginRight: 5,
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

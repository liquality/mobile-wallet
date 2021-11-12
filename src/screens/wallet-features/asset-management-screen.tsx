import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native'
import { AssetDataElementType } from '../../types'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMinus, faPlus } from '@fortawesome/pro-light-svg-icons'
import AssetIcon from '../../components/asset-icon'
import { formatFiat, prettyBalance } from '../../core/utils/coin-formatter'
import Switch from '../../components/ui/switch'
import { useAppSelector, useWalletState } from '../../hooks'
import SearchBox from '../../components/ui/search-box'
import { chains } from '@liquality/cryptoassets'
import config from '../../core/config'
import BigNumber from 'bignumber.js'

const AssetManagementScreen = (): React.ReactElement => {
  const DEFAULT_COLOR = '#EFEFEF'
  const { assets } = useWalletState()
  const [data, setData] = useState<Array<AssetDataElementType>>(assets)
  const { activeNetwork } = useAppSelector((state) => ({
    activeNetwork: state.activeNetwork,
  }))

  const toggleRow = useCallback(
    (itemId: string) => {
      setData(
        data.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              showAssets: !item.showAssets,
              activeNetwork,
            }
          } else {
            return item
          }
        }),
      )
    },
    [activeNetwork, data],
  )

  useEffect(() => {
    const myAssets = config.chains.map(
      (chain, idx) =>
        ({
          id: `${idx}`,
          name: chain,
          code: chains[chain]?.code,
          assets: [],
          balance: new BigNumber(100),
          balanceInUSD: new BigNumber(100),
        } as AssetDataElementType),
    )
    setData([...assets, ...myAssets])
  }, [assets])

  const renderAsset = ({ item }: { item: AssetDataElementType }) => {
    const { name, balanceInUSD } = item
    const isNested = item.assets && item.assets.length > 0

    return (
      <Fragment>
        <View
          style={[
            styles.row,
            { borderLeftColor: item.color || DEFAULT_COLOR },
          ]}>
          <View style={styles.col1}>
            <Pressable onPress={() => toggleRow(item.id)}>
              {isNested && (
                <FontAwesomeIcon
                  size={15}
                  icon={item.showAssets ? faMinus : faPlus}
                  color={'#A8AEB7'}
                  style={styles.plusSign}
                />
              )}
            </Pressable>
            <AssetIcon chain={item.chain} asset={item.code} />
          </View>
          <View style={styles.col2}>
            <Text style={styles.code}>{name}</Text>
            {isNested && (
              <Text style={styles.TotalBalanceInUSD}>
                Total ${balanceInUSD && formatFiat(balanceInUSD)}
              </Text>
            )}
          </View>
          <View style={styles.col3}>
            <Switch enableFeature={() => ({})} isFeatureEnabled={true} />
          </View>
        </View>
        {isNested &&
          item.showAssets &&
          item.assets!.map((subElem) => {
            return (
              <View
                style={[
                  styles.row,
                  styles.subElement,
                  { borderLeftColor: item.color || DEFAULT_COLOR },
                ]}
                key={subElem.id}>
                <View style={styles.col1}>
                  <AssetIcon chain={subElem.chain} asset={subElem.code} />
                </View>
                <View style={styles.col2}>
                  <Text style={styles.code}>{subElem.name}</Text>
                  <Text style={styles.balance}>
                    {subElem.balance &&
                      subElem.code &&
                      `${prettyBalance(subElem.balance, subElem.code)} ${
                        subElem.code
                      }`}
                  </Text>
                </View>
                <View style={styles.col3}>
                  <Switch enableFeature={() => ({})} isFeatureEnabled={true} />
                </View>
              </View>
            )
          })}
      </Fragment>
    )
  }
  return (
    <View style={styles.container}>
      <SearchBox assets={assets} updateData={setData} />
      <FlatList
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
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#D9DFE5',
    borderLeftWidth: 3,
    paddingVertical: 10,
  },
  col1: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  col2: {
    flex: 0.65,
    justifyContent: 'center',
  },
  col3: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  plusSign: {
    marginRight: 5,
  },
  subElement: {
    paddingLeft: 50,
  },
  code: {
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    fontSize: 12,
    marginBottom: 5,
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
    marginBottom: 5,
  },
})

export default AssetManagementScreen

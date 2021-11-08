import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faGreaterThan,
  faPlus,
  faMinus,
} from '@fortawesome/pro-light-svg-icons'
import * as React from 'react'
import { formatFiat, prettyBalance } from '../core/utils/coin-formatter'
import AssetIcon from './asset-icon'
import GasIndicator from './ui/gas-indicator'
import { Fragment, useEffect, useState } from 'react'
import { useAppSelector } from '../hooks'
import { AssetDataElementType, StackPayload } from '../types'

const AssetFlatList = ({
  assets,
  onAssetSelected,
}: {
  assets: Array<AssetDataElementType>
  onAssetSelected: (params: StackPayload) => void
}) => {
  const [data, setData] = useState<Array<AssetDataElementType>>(assets)
  const { activeNetwork } = useAppSelector((state) => ({
    activeNetwork: state.activeNetwork,
  }))

  const toggleRow = (itemId: string) => {
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
  }

  useEffect(() => {
    setData(assets)
  }, [assets])

  const renderAsset = ({ item }: { item: AssetDataElementType }) => {
    const { name, address, balance, balanceInUSD, fees } = item
    const isNested = item.assets && item.assets.length > 0

    return (
      <Fragment>
        <View style={[styles.row, { borderLeftColor: item.color }]}>
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
            <AssetIcon asset={item.id} />
          </View>
          <View style={styles.col2}>
            <Text style={styles.code}>{name}</Text>
            <Text style={styles.address}>
              {`${address?.substring(0, 4)}...${address?.substring(
                address?.length - 4,
              )}`}
            </Text>
          </View>
          {!isNested && (
            <View style={styles.col3}>
              <Text style={styles.balance}>
                {balance && formatFiat(balance)}
              </Text>
              <Text style={styles.balanceInUSD}>
                {balanceInUSD && formatFiat(balanceInUSD)}
              </Text>
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
                Total ${balanceInUSD && formatFiat(balanceInUSD)}
              </Text>
              <View style={styles.gas}>
                <GasIndicator balance={balance!.toNumber()} gasFees={fees!} />
              </View>
            </View>
          )}
        </View>
        {isNested &&
          item.showAssets &&
          item.assets!.map((subElem) => {
            return (
              <View
                style={[
                  styles.row,
                  styles.subElement,
                  { borderLeftColor: item.color },
                ]}
                key={subElem.id}>
                <View style={styles.col1}>
                  <AssetIcon asset={subElem.code} />
                </View>
                <View style={styles.col2}>
                  <Text style={styles.code}>{subElem.name}</Text>
                </View>
                <View style={styles.col3}>
                  <Text style={styles.balance}>
                    {subElem.balance &&
                      subElem.code &&
                      `${prettyBalance(subElem.balance, subElem.code)} ${
                        subElem.code
                      }`}
                  </Text>
                  <Text style={styles.balanceInUSD}>
                    ${subElem.balanceInUSD && formatFiat(subElem.balanceInUSD)}
                  </Text>
                </View>
                <View style={styles.col4}>
                  <Pressable
                    onPress={() =>
                      onAssetSelected({
                        assetData: {
                          ...subElem,
                          address: item.address,
                        },
                        screenTitle: subElem.code,
                      })
                    }>
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
      </Fragment>
    )
  }

  return (
    <FlatList
      data={data}
      renderItem={renderAsset}
      keyExtractor={(item) => item.id}
    />
  )
}

const styles = StyleSheet.create({
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
    flex: 0.2,
    justifyContent: 'center',
  },
  col3: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  col4: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 5,
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
  getGas: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#D9DFE5',
  },
})

export default AssetFlatList

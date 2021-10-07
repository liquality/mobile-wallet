import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faGreaterThan,
  faPlus,
  faMinus,
} from '@fortawesome/pro-light-svg-icons'
import {
  faTachometerAltAverage,
  faTachometerAltSlowest,
} from '@fortawesome/pro-duotone-svg-icons'
import * as React from 'react'
import ETHIcon from '../assets/icons/crypto/eth.svg'
import BTCIcon from '../assets/icons/crypto/btc.svg'
import { FeeDetails } from '@liquality/types/lib/fees'

export type DataElementType = {
  id: string
  name: string
  address?: string
  balance: number
  balanceInUSD: number
  color?: string
  assets?: Array<DataElementType>
  showAssets?: boolean
  fees?: FeeDetails
}

const AssetFlatList = ({
  assets,
  toggleRow,
}: {
  assets: Array<DataElementType>
  toggleRow: (itemId: string) => void
}) => {
  const getAssetIcon = (asset: string) => {
    if (asset === 'eth' || asset === 'ethereum') {
      return <ETHIcon width={28} height={28} />
    } else {
      return <BTCIcon width={28} height={28} />
    }
  }

  const renderAsset = ({ item }: { item: DataElementType }) => {
    const { name, address, balance, balanceInUSD, fees } = item
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
              {isNested && (
                <FontAwesomeIcon
                  size={15}
                  icon={item.showAssets ? faMinus : faPlus}
                  color={'#A8AEB7'}
                  style={styles.plusSign}
                />
              )}
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
                {fees?.slow?.fee && balance >= fees.slow.fee ? (
                  <View style={styles.gas}>
                    <FontAwesomeIcon
                      size={20}
                      icon={faTachometerAltAverage}
                      color={'#000'}
                      secondaryColor={'#1CE5C3'}
                      style={styles.gasIcon}
                    />
                    <Text style={styles.gasLabel}>Gas</Text>
                  </View>
                ) : (
                  <View style={styles.getGas}>
                    <FontAwesomeIcon
                      size={20}
                      icon={faTachometerAltSlowest}
                      color={'#000'}
                      secondaryColor={'#1CE5C3'}
                      style={styles.gasIcon}
                    />
                    <Text style={styles.gasLabel}>Get Gas</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
        {isNested &&
          item.showAssets &&
          item.assets!.map((subElem) => {
            return (
              <View style={[styles.row, styles.subElement]} key={subElem.id}>
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

  return (
    <FlatList
      contentContainerStyle={styles.detailsBlock}
      data={assets}
      renderItem={renderAsset}
      keyExtractor={(item) => item.id}
    />
  )
}

const styles = StyleSheet.create({
  detailsBlock: {
    flex: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
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
  name: {
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

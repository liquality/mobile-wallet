import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { AssetDataElementType, StackPayload } from '../../types'
import { chainDefaultColors } from '../../core/config'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faChevronRight,
  faMinus,
  faPlus,
} from '@fortawesome/pro-light-svg-icons'
import AssetIcon from '../asset-icon'
import { formatFiat, prettyBalance } from '../../core/utils/coin-formatter'
import AssetListSwipeableRow from '../asset-list-swipeable-row'
import { BigNumber } from '@liquality/types'

const DEFAULT_COLOR = '#EFEFEF'

type RowProps = {
  item: AssetDataElementType
  toggleRow: (itemId: string) => void
  onAssetSelected: (params: StackPayload) => void
  isNested: boolean
}

const Row: React.FC<RowProps> = (props) => {
  const { item, toggleRow, onAssetSelected, isNested } = props
  const { name, address, balanceInUSD, chain } = item
  const chainColor = chain ? chainDefaultColors[chain] : DEFAULT_COLOR

  const handlePressOnRow = () => {
    if (isNested) {
      toggleRow(item.id)
    } else {
      onAssetSelected({
        assetData: {
          ...item,
          address: item.address,
        },
        screenTitle: item.code,
      })
    }
  }

  return (
    <AssetListSwipeableRow
      assetData={{
        ...item,
        address: item.address,
      }}
      assetSymbol={item.code}>
      <Pressable
        style={[styles.row, { borderLeftColor: chainColor }]}
        onPress={handlePressOnRow}>
        <View style={styles.col1}>
          <Pressable onPress={() => toggleRow(item.id)}>
            <FontAwesomeIcon
              size={15}
              icon={item.showAssets ? faMinus : faPlus}
              color={isNested ? '#A8AEB7' : '#FFF'}
              style={styles.plusSign}
            />
          </Pressable>
          <AssetIcon chain={item.chain} />
        </View>
        <View style={styles.col2}>
          <Text style={styles.code}>{name}</Text>
          <Text style={styles.address}>
            {`${address?.substring(0, 4)}...${address?.substring(
              address?.length - 4,
            )}`}
          </Text>
        </View>
        {isNested ? (
          <View style={styles.col3}>
            <Text style={styles.TotalBalanceInUSD}>
              Total ${balanceInUSD && formatFiat(balanceInUSD)}
            </Text>
            {/* <View style={styles.gas}>
              <GasIndicator balance={balance || 0} gasFees={fees} />
            </View> */}
          </View>
        ) : (
          <View style={styles.col3}>
            <Text style={styles.balance}>
              {item.balance &&
                item.code &&
                `${prettyBalance(new BigNumber(item.balance), item.code)} ${
                  item.code
                }`}
            </Text>
            <Text style={styles.balanceInUSD}>
              ${balanceInUSD && formatFiat(balanceInUSD)}
            </Text>
          </View>
        )}
        <View style={styles.col4}>
          {isNested ? (
            <FontAwesomeIcon size={20} icon={faChevronRight} color={'#FFF'} />
          ) : (
            <Pressable
              onPress={() =>
                onAssetSelected({
                  assetData: {
                    ...item,
                    address: item.address,
                  },
                  screenTitle: item.code,
                })
              }>
              <FontAwesomeIcon
                size={20}
                icon={faChevronRight}
                color={'#A8AEB7'}
              />
            </Pressable>
          )}
        </View>
      </Pressable>
    </AssetListSwipeableRow>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
    borderLeftWidth: 3,
    paddingVertical: 10,
    height: 60,
  },
  col1: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  col2: {
    flex: 0.25,
    justifyContent: 'center',
  },
  col3: {
    flex: 0.5,
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
    marginLeft: 10,
  },
  code: {
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    fontWeight: '500',
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
  gas: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
})

export default Row

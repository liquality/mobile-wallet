import React, { memo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { AssetDataElementType, StackPayload } from '../../types'
import ChevronRight from '../../assets/icons/activity-status/chevron-right.svg'
import MinusSign from '../../assets/icons/minus-sign.svg'
import PlusSign from '../../assets/icons/plus-icon.svg'
import AssetIcon from '../asset-icon'
import {
  formatFiat,
  prettyBalance,
} from '@liquality/wallet-core/dist/utils/coinFormatter'
import AssetListSwipeableRow from '../asset-list-swipeable-row'
import { BigNumber } from '@liquality/types'
import { shortenAddress } from '@liquality/wallet-core/dist/utils/address'

type RowProps = {
  item: AssetDataElementType
  toggleRow: (itemId: string) => void
  onAssetSelected: (params: StackPayload) => void
  isNested: boolean
}

const Row: React.FC<RowProps> = (props) => {
  const { item, toggleRow, onAssetSelected, isNested } = props
  const { name, address, balanceInUSD } = item

  const handlePressOnRow = () => {
    if (isNested) {
      toggleRow(item.id)
    } else {
      onAssetSelected({
        assetData: item,
        screenTitle: item.code,
      })
    }
  }

  return (
    <AssetListSwipeableRow assetData={item} assetSymbol={item.code}>
      <Pressable
        style={[styles.row, { borderLeftColor: item.color }]}
        onPress={handlePressOnRow}>
        <View style={styles.col1}>
          <Pressable onPress={() => toggleRow(item.id)}>
            {item.showAssets ? (
              <MinusSign
                width={15}
                height={15}
                fill={isNested ? '#A8AEB7' : '#FFF'}
                style={styles.plusSign}
              />
            ) : (
              <PlusSign
                width={15}
                height={15}
                fill={isNested ? '#A8AEB7' : '#FFF'}
                style={styles.plusSign}
              />
            )}
          </Pressable>
          <AssetIcon chain={item.chain} />
        </View>
        <View style={styles.col2}>
          <Text style={styles.code}>{name}</Text>
          <Text style={styles.address}>
            {address && shortenAddress(address)}
          </Text>
        </View>
        {isNested ? (
          <View style={styles.col3}>
            <Text style={styles.TotalBalanceInUSD}>
              {`Total $${
                balanceInUSD ? formatFiat(new BigNumber(balanceInUSD)) : 0
              }`}
            </Text>
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
              {`$${balanceInUSD ? formatFiat(new BigNumber(balanceInUSD)) : 0}`}
            </Text>
          </View>
        )}
        <View style={styles.col4}>
          {isNested ? (
            <ChevronRight width={12} height={12} />
          ) : (
            <Pressable
              onPress={() =>
                onAssetSelected({
                  assetData: item,
                  screenTitle: item.code,
                })
              }>
              <ChevronRight width={12} height={12} />
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
})

export default memo(Row)

import React, { FC, memo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import {
  formatFiat,
  prettyBalance,
} from '@liquality/wallet-core/dist/utils/coinFormatter'
import ChevronRight from '../../assets/icons/activity-status/chevron-right.svg'
import { AssetDataElementType, StackPayload } from '../../types'
import AssetIcon from '../asset-icon'
import AssetListSwipeableRow from '../asset-list-swipeable-row'
import { BigNumber } from '@liquality/types'

type SubRowProps = {
  parentItem: AssetDataElementType
  item: AssetDataElementType
  onAssetSelected: (params: StackPayload) => void
}

const SubRow: FC<SubRowProps> = (props) => {
  const { parentItem, item, onAssetSelected } = props

  const handlePressOnRow = () => {
    onAssetSelected({
      assetData: {
        ...item,
        address: parentItem.address,
      },
      screenTitle: item.code,
    })
  }

  return (
    <AssetListSwipeableRow
      assetData={{
        ...item,
        address: parentItem.address,
      }}
      assetSymbol={item.code}>
      <Pressable
        onPress={handlePressOnRow}
        style={[
          styles.row,
          styles.subElement,
          { borderLeftColor: parentItem.color },
        ]}>
        <View style={styles.col1}>
          <AssetIcon size={25} asset={item.code} />
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <View style={styles.col2}>
          <Text style={styles.balance}>
            {item.balance &&
              item.code &&
              `${prettyBalance(new BigNumber(item.balance), item.code)} ${
                item.code
              }`}
          </Text>
          <Text style={styles.balanceInUSD}>
            {`$${
              item.balanceInUSD
                ? formatFiat(new BigNumber(item.balanceInUSD))
                : 0
            }`}
          </Text>
        </View>
        <View style={styles.col3}>
          <Pressable
            onPress={() =>
              onAssetSelected({
                assetData: {
                  ...item,
                  address: parentItem.address,
                },
                screenTitle: item.code,
              })
            }>
            <ChevronRight width={12} height={12} />
          </Pressable>
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
    flex: 0.35,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  col2: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  col3: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subElement: {
    paddingLeft: 50,
  },
  name: {
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    fontWeight: '500',
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
})

export default memo(SubRow)

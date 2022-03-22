import { AssetDataElementType, StackPayload } from '../../types'
import React, { FC } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import AssetIcon from '../asset-icon'
import { formatFiat, prettyBalance } from '../../core/utils/coin-formatter'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronRight } from '@fortawesome/pro-light-svg-icons'
import { chainDefaultColors } from '../../core/config'

type SubRowProps = {
  parentItem: AssetDataElementType
  item: AssetDataElementType
  onAssetSelected: (params: StackPayload) => void
}

const DEFAULT_COLOR = '#EFEFEF'

const SubRow: FC<SubRowProps> = (props) => {
  const { parentItem, item, onAssetSelected } = props
  const chainColor = parentItem.chain
    ? chainDefaultColors[parentItem.chain]
    : DEFAULT_COLOR

  return (
    <View
      style={[styles.row, styles.subElement, { borderLeftColor: chainColor }]}
      key={item.id}>
      <View style={styles.col1}>
        <AssetIcon size={25} asset={item.code} />
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <View style={styles.col2}>
        <Text style={styles.balance}>
          {item.balance &&
            item.code &&
            `${prettyBalance(item.balance, item.code)} ${item.code}`}
        </Text>
        <Text style={styles.balanceInUSD}>
          ${item.balanceInUSD && formatFiat(item.balanceInUSD)}
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
          <FontAwesomeIcon size={20} icon={faChevronRight} color={'#A8AEB7'} />
        </Pressable>
      </View>
    </View>
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

export default SubRow

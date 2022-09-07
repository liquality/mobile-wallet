import React, { FC, useCallback, useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import {
  cryptoToFiat,
  formatFiat,
  prettyBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import ChevronRight from '../../assets/icons/activity-status/chevron-right.svg'
import { AccountType } from '../../types'
import AssetIcon from '../asset-icon'
import AssetListSwipeableRow from '../asset-list-swipeable-row'
import { BigNumber } from '@liquality/types'
import { useRecoilValue } from 'recoil'
import {
  addressStateFamily,
  balanceStateFamily,
  fiatRatesState,
  networkState,
} from '../../atoms'
import { unitToCurrency, getAsset } from '@liquality/cryptoassets'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'

type SubRowProps = {
  parentItem: AccountType
  item: AccountType
  onAssetSelected: () => void
}

const SubRow: FC<SubRowProps> = (props) => {
  const { parentItem, item, onAssetSelected } = props
  const [prettyNativeBalance, setPrettyNativeBalance] = useState('')
  const [prettyFiatBalance, setPrettyFiatBalance] = useState('')
  const balance = useRecoilValue(
    balanceStateFamily({ asset: item.code, assetId: parentItem.id }),
  )
  const address = useRecoilValue(addressStateFamily(item.id))
  const fiatRates = useRecoilValue(fiatRatesState)
  const activeNetwork = useRecoilValue(networkState)

  const handlePressOnRow = useCallback(() => {
    onAssetSelected()
  }, [onAssetSelected])

  useEffect(() => {
    const fiatBalance = fiatRates[item.code]
      ? cryptoToFiat(
          unitToCurrency(
            getAsset(activeNetwork, getNativeAsset(item.code)),
            balance,
          ).toNumber(),
          fiatRates[item.code],
        )
      : 0
    setPrettyNativeBalance(
      `${prettyBalance(new BigNumber(balance), item.code)} ${item.code}`,
    )
    setPrettyFiatBalance(`$${formatFiat(new BigNumber(fiatBalance))}`)
  }, [activeNetwork, balance, fiatRates, item.code])

  return (
    <AssetListSwipeableRow
      assetData={{
        ...item,
        address: address,
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
          <Text style={styles.balance}>{prettyNativeBalance}</Text>
          <Text style={styles.balanceInUSD}>{prettyFiatBalance}</Text>
        </View>
        <View style={styles.col3}>
          <ChevronRight width={12} height={12} />
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

export default SubRow

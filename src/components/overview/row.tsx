import React, { memo, useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { AccountType } from '../../types'
import ChevronRight from '../../assets/icons/activity-status/chevron-right.svg'
import MinusSign from '../../assets/icons/minus-sign.svg'
import PlusSign from '../../assets/icons/plus-icon.svg'
import AssetIcon from '../asset-icon'
import {
  cryptoToFiat,
  formatFiat,
  prettyBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import AssetListSwipeableRow from '../asset-list-swipeable-row'
import { BigNumber } from '@liquality/types'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import { useRecoilValue, useRecoilState } from 'recoil'
import {
  addressStateFamily,
  balanceStateFamily,
  fiatRatesState,
  doubleOrLongTapSelectedAsset as doubTap,
} from '../../atoms'
import { unitToCurrency, assets as cryptoassets } from '@liquality/cryptoassets'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import I18n from 'i18n-js'
import GestureDetector from '../gesture-detector/gesture-detector'
import Box from '../../theme/box'
import Card from '../../theme/card'
import Text from '../../theme/text'

type RowProps = {
  item: AccountType
  toggleRow: () => void
  onAssetSelected: () => void
  isNested: boolean
  isExpanded: boolean
}

const Row = (props: RowProps) => {
  const { item, toggleRow, onAssetSelected, isNested, isExpanded } = props
  const { name } = item
  const [prettyFiatBalance, setPrettyFiatBalance] = useState('0')
  const [prettyNativeBalance, setPrettyNativeBalance] = useState('0')
  const [shortAddress, setShortAddress] = useState('')
  const balance = useRecoilValue(
    balanceStateFamily({ asset: item.code, assetId: item.id }),
  )
  const address = useRecoilValue(addressStateFamily(item.id))
  const fiatRates = useRecoilValue(fiatRatesState)
  const [doubleOrLongTapSelectedAsset, setDoubleOrLongTapSelectedAsset] =
    useRecoilState(doubTap)

  const handlePressOnRow = useCallback(() => {
    setDoubleOrLongTapSelectedAsset('')
    if (isNested) {
      toggleRow()
    } else {
      onAssetSelected()
    }
  }, [isNested, onAssetSelected, toggleRow, setDoubleOrLongTapSelectedAsset])

  const handleDoubleOrLongPress = useCallback(() => {
    setDoubleOrLongTapSelectedAsset(item.id)
  }, [setDoubleOrLongTapSelectedAsset, item.id])

  useEffect(() => {
    const fiatBalance = fiatRates[item.code]
      ? cryptoToFiat(
          unitToCurrency(
            cryptoassets[getNativeAsset(item.code)],
            balance,
          ).toNumber(),
          fiatRates[item.code],
        )
      : 0
    setPrettyNativeBalance(
      `${prettyBalance(new BigNumber(balance), item.code)} ${item.code}`,
    )
    setPrettyFiatBalance(`$${formatFiat(new BigNumber(fiatBalance))}`)
    if (address) setShortAddress(shortenAddress(address))
  }, [address, balance, fiatRates, item.code])

  const showPopup = item.id === doubleOrLongTapSelectedAsset

  const gas = 0.1234
  const availableGas = I18n.t('overviewScreen.availableGas', {
    gas,
    token: item.code,
  })

  return (
    <AssetListSwipeableRow assetData={item} assetSymbol={item.code}>
      <GestureDetector
        onSingleTap={handlePressOnRow}
        doubleOrLongPress={handleDoubleOrLongPress}>
        <View style={[styles.row, { borderLeftColor: item.color }]}>
          {showPopup ? (
            <Box
              position={'absolute'}
              left={0}
              right={0}
              top={0}
              bottom={0}
              zIndex={1}>
              <Box flex={1} alignItems="center" justifyContent={'center'}>
                <Card
                  variant={'popUpCard'}
                  style={{ borderLeftColor: item.color }}>
                  <Box flexDirection={'row'} alignItems={'center'} flex={1}>
                    <Box
                      width={30}
                      height={30}
                      borderRadius={15}
                      marginHorizontal={'s'}
                      style={{ backgroundColor: item.color }}
                    />
                    <Box flex={1}>
                      <Text>{item.name}</Text>
                      <Text fontSize={12} color="tertiaryForeground">
                        {shortAddress}
                      </Text>
                      <Text fontSize={12} color="tertiaryForeground">
                        {availableGas}
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    position={'absolute'}
                    right={-7}
                    top={0}
                    bottom={0}
                    zIndex={1}>
                    <Box flex={1} alignItems="center" justifyContent={'center'}>
                      <Card
                        variant={'rightArrowCard'}
                        style={{ transform: [{ rotate: '-45deg' }] }}
                      />
                    </Box>
                  </Box>
                </Card>
              </Box>
            </Box>
          ) : null}
          <View style={styles.col1}>
            <>
              {isExpanded ? (
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
            </>
            <AssetIcon chain={item.chain} />
          </View>
          <View style={styles.col2}>
            <Text style={styles.code}>{name}</Text>
            <Text style={styles.address}>{shortAddress}</Text>
          </View>
          {isNested ? (
            <View style={styles.col3}>
              <Text style={styles.TotalBalanceInUSD}>
                {I18n.t('common.totalPrettyFiatBal', { prettyFiatBalance })}
              </Text>
            </View>
          ) : (
            <View style={styles.col3}>
              <Text style={styles.balance}>{prettyNativeBalance}</Text>
              <Text style={styles.balanceInUSD}>{prettyFiatBalance}</Text>
            </View>
          )}
          <View style={styles.col4}>
            {!isNested ? <ChevronRight width={12} height={12} /> : null}
          </View>
        </View>
      </GestureDetector>
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
    height: 70,
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

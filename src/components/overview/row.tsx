import React, { memo, useCallback, useEffect, useState } from 'react'
import { LayoutChangeEvent, Platform, StyleSheet } from 'react-native'
import { AccountType } from '../../types'
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
  networkState,
} from '../../atoms'
import { unitToCurrency, getAsset } from '@liquality/cryptoassets'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import I18n from 'i18n-js'
import GestureDetector from '../gesture-detector/gesture-detector'
import { Text, Box, Card, palette, faceliftPalette } from '../../theme'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { fetchFeesForAsset } from '../../store/store'
import { FADE_IN_OUT_DURATION } from '../../utils'
import { AppIcons } from '../../assets'
import { scale } from 'react-native-size-matters'
import { Path, Svg } from 'react-native-svg'
import CombinedChainAssetIcons from '../ui/CombinedChainAssetIcons'

const { MinusSign, PlusSign } = AppIcons

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
  const activeNetwork = useRecoilValue(networkState)
  const [gas, setGasFee] = useState<BigNumber>(new BigNumber(0))
  const [borderWidth, setBorderWidth] = useState(0)
  const [rowWidth, setRowWidth] = useState(0)
  const [rowHeight, setRowHeight] = useState(0)

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
    setTimeout(() => {
      setDoubleOrLongTapSelectedAsset('')
    }, 3000)
  }, [setDoubleOrLongTapSelectedAsset, item.id])

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
    if (address) setShortAddress(shortenAddress(address))
  }, [activeNetwork, address, balance, fiatRates, item.code])

  useEffect(() => {
    fetchFeesForAsset(item.code).then((gasFee) => {
      setGasFee(gasFee.average)
    })
  }, [item.code])

  const showPopup = item.id === doubleOrLongTapSelectedAsset

  const availableGas = I18n.t('overviewScreen.availableGas', {
    gas: new BigNumber(gas.toFixed(3)),
    token: item.code,
  })

  const getBackgroundBox = () => {
    const width = rowWidth
    const height = rowHeight
    const flatRadius = 20
    return (
      <Box
        alignItems="center"
        justifyContent="center"
        style={StyleSheet.absoluteFillObject}>
        <Svg
          width={`${width}`}
          height={`${height}`}
          viewBox={`0 0 ${width} ${height}`}
          fill={faceliftPalette.white}>
          <Path
            d={`M0 0 H ${
              width - flatRadius
            } L ${width} ${flatRadius} V ${height} H ${0} V ${0} Z`}
            strokeWidth={2}
            stroke={faceliftPalette.whiteGrey}
            strokeLinejoin={'round'}
            strokeLinecap={'round'}
          />
        </Svg>
      </Box>
    )
  }

  const onLayout = (event: LayoutChangeEvent) => {
    setRowHeight(event.nativeEvent.layout.height)
    setRowWidth(event.nativeEvent.layout.width)
  }

  return (
    <AssetListSwipeableRow
      assetData={item}
      assetSymbol={item.code}
      isNested={isNested}
      onOpen={() => setBorderWidth(2)}
      onClose={() => setBorderWidth(0)}>
      <GestureDetector
        onSingleTap={handlePressOnRow}
        doubleOrLongPress={handleDoubleOrLongPress}>
        <Box
          flexDirection={'row'}
          justifyContent="space-around"
          paddingVertical={'m'}
          height={70}
          backgroundColor={borderWidth ? 'selectedBackgroundColor' : 'white'}
          paddingRight={borderWidth ? 'mxxl' : 's'}
          onLayout={onLayout}>
          {borderWidth ? getBackgroundBox() : null}
          <Box
            height={scale(50)}
            width={scale(3)}
            style={{ backgroundColor: item.color }}
          />
          {isNested ? (
            <Box paddingLeft={'m'}>
              <>
                {isExpanded ? (
                  <MinusSign
                    width={10}
                    height={10}
                    fill={isNested ? palette.nestedColor : palette.white}
                  />
                ) : (
                  <PlusSign
                    width={10}
                    height={10}
                    fill={isNested ? palette.nestedColor : palette.white}
                  />
                )}
              </>
            </Box>
          ) : (
            <Box paddingLeft={'m'}>
              <Box width={10} height={10} />
            </Box>
          )}
          <Box flex={0.1} paddingLeft={'m'}>
            {isNested ? (
              <AssetIcon chain={item.chain} size={scale(30)} />
            ) : (
              <CombinedChainAssetIcons chain={item.chain} code={item.code} />
            )}
          </Box>
          <Box flex={0.5} paddingLeft={'m'}>
            <Text variant={'listText'} color="darkGrey">
              {name}
            </Text>
            <Text variant={'subListText'} color="greyMeta">
              {shortAddress}
            </Text>
          </Box>
          {isNested ? (
            <Box flex={0.4} alignItems="flex-end">
              <Text variant={'listText'} color="darkGrey">
                {prettyFiatBalance}
              </Text>
            </Box>
          ) : (
            <Box flex={0.4} paddingRight={'s'} alignItems="flex-end">
              <Text variant={'listText'} color="darkGrey">
                {prettyNativeBalance}
              </Text>
              <Text variant={'subListText'} color="greyMeta">
                {prettyFiatBalance}
              </Text>
            </Box>
          )}
          {showPopup ? (
            <Box position={'absolute'} left={0} right={0} top={0} bottom={0}>
              <Box flex={1} alignItems="center" justifyContent={'center'}>
                <Animated.View
                  key={'popUpCard'}
                  entering={FadeIn.duration(FADE_IN_OUT_DURATION)}
                  exiting={FadeOut.duration(FADE_IN_OUT_DURATION)}>
                  <Card
                    variant={'popUpCard'}
                    width={'65%'}
                    height={'95%'}
                    paddingHorizontal={'s'}
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
                    {Platform.OS === 'ios' && (
                      <Box position={'absolute'} right={-7} top={0} bottom={0}>
                        <Box
                          flex={1}
                          alignItems="center"
                          justifyContent={'center'}>
                          <Card
                            variant={'rightArrowCard'}
                            style={{ transform: [{ rotate: '-45deg' }] }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Card>
                </Animated.View>
              </Box>
            </Box>
          ) : null}
        </Box>
      </GestureDetector>
    </AssetListSwipeableRow>
  )
}

export default memo(Row)

import React, { FC, Fragment, useCallback, useEffect, useState } from 'react'
import { LayoutChangeEvent, Pressable, StyleSheet } from 'react-native'
import {
  cryptoToFiat,
  formatFiat,
  prettyBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { AccountType } from '../../types'
import AssetListSwipeableRow from '../asset-list-swipeable-row'
import { BigNumber } from '@liquality/types'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  balanceStateFamily,
  doubleOrLongTapSelectedAsset,
  fiatRatesState,
  networkState,
} from '../../atoms'
import { unitToCurrency, getAsset } from '@liquality/cryptoassets'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import { getNftsForAccount, updateNFTs } from '../../store/store'
import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { Box, Text } from '../../theme'
import { scale } from 'react-native-size-matters'
import { AppIcons } from '../../assets'
import RowBackgroundBox from './RowBackgroundBox'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import AssetIcon from '../asset-icon'
import NFTIcon from '../../assets/icons/crypto/nft.svg'
const { ChevronRightIcon: ChevronRight } = AppIcons

type SubRowProps = {
  parentItem: Partial<AccountType>
  item: AccountType | {}
  onAssetSelected: () => void
  nft?: boolean
}
const wallet = setupWallet({
  ...defaultOptions,
})

const SubRow: FC<SubRowProps> = (props) => {
  const { parentItem, item, onAssetSelected, nft } = props
  const [prettyNativeBalance, setPrettyNativeBalance] = useState('')
  const [prettyFiatBalance, setPrettyFiatBalance] = useState('')
  const balance = useRecoilValue(
    balanceStateFamily({ asset: item.code, assetId: parentItem.id }),
  )
  const fiatRates = useRecoilValue(fiatRatesState)
  const activeNetwork = useRecoilValue(networkState)
  const [chainSpecificNfts, setChainSpecificNfts] = useState({})
  const [accountIdsToSendIn] = useState<string[]>([])
  const [numberOfNfts, setNumberOfNfts] = useState<number>()
  const [borderWidth, setBorderWidth] = useState(0)
  const [rowWidth, setRowWidth] = useState(0)
  const [rowHeight, setRowHeight] = useState(0)
  const { activeWalletId } = wallet.state
  const clearDoubleOrLongTapSelectedAsset = useSetRecoilState(
    doubleOrLongTapSelectedAsset,
  )
  const ROW_HEIGHT = scale(70)
  const height = useSharedValue(0)

  const onLayout = (event: LayoutChangeEvent) => {
    setRowHeight(event.nativeEvent.layout.height)
    setRowWidth(event.nativeEvent.layout.width)
  }

  const handlePressOnRow = useCallback(() => {
    clearDoubleOrLongTapSelectedAsset('')

    onAssetSelected()
  }, [clearDoubleOrLongTapSelectedAsset, onAssetSelected])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    }
  })

  useEffect(() => {
    height.value = withTiming(ROW_HEIGHT, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    })
  }, [ROW_HEIGHT, height])

  useEffect(() => {
    async function fetchData() {
      await updateNFTs({
        walletId: activeWalletId,
        network: activeNetwork,
        accountIds: accountIdsToSendIn,
      })
      //Use dummydata here if no assets load
      let nfts = await getNftsForAccount(parentItem.id)
      let totalAmountOfNfts = Object.values(nfts).reduce(
        (acc, nft) => acc + nft.length,
        0,
      )
      setNumberOfNfts(totalAmountOfNfts)
      setChainSpecificNfts(nfts)
    }
    fetchData()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetwork, balance, fiatRates, item.code])

  const renderNFTRow = () => {
    if (Object.keys(chainSpecificNfts).length > 0) {
      return (
        <Animated.View style={animatedStyle}>
          <Pressable onPress={handlePressOnRow} style={styles.row}>
            <Box
              height={scale(50)}
              width={scale(3)}
              style={{ borderLeftColor: parentItem.color, borderLeftWidth: 3 }}
            />
            <Box paddingLeft={'m'}>
              <Box width={10} height={10} />
            </Box>
            <Box flex={0.1} paddingLeft={'m'} />
            <Box flex={0.55} flexDirection="row" paddingLeft="m">
              <NFTIcon width={scale(25)} height={scale(25)} />
              <Box width={'80%'} paddingLeft="m">
                <Text numberOfLines={1} variant={'listText'} color="darkGrey">
                  NFT <Text color="mediumGrey">|</Text> {numberOfNfts}{' '}
                </Text>
              </Box>
            </Box>
            <Box
              flex={0.45}
              flexDirection={'row'}
              justifyContent="flex-end"
              alignItems={'center'}
              paddingLeft={'s'}>
              <Text
                variant={'listText'}
                color="darkGrey"
                numberOfLines={1}
                lineHeight={scale(1.5 * 14)}
                marginRight={'m'}
                style={{ height: scale(1.2 * 13) }}>
                See All
              </Text>
              <ChevronRight />
            </Box>
          </Pressable>
        </Animated.View>
      )
    } else return null
  }

  return (
    <Fragment>
      {nft ? (
        renderNFTRow()
      ) : (
        <Animated.View style={animatedStyle}>
          <AssetListSwipeableRow
            assetData={{
              ...item,
              id: parentItem.id,
              balance,
            }}
            assetSymbol={item.code}
            onOpen={() => setBorderWidth(2)}
            onClose={() => setBorderWidth(0)}>
            <Pressable onPress={handlePressOnRow}>
              <Box
                flexDirection={'row'}
                justifyContent="space-around"
                alignItems={'center'}
                paddingVertical={'m'}
                height={ROW_HEIGHT}
                backgroundColor={
                  borderWidth ? 'selectedBackgroundColor' : 'white'
                }
                paddingRight={borderWidth ? 'mxxl' : 's'}
                onLayout={onLayout}>
                {borderWidth ? (
                  <RowBackgroundBox width={rowWidth} height={rowHeight} />
                ) : null}
                <Box
                  height={scale(50)}
                  width={scale(3)}
                  style={{ borderLeftColor: item.color, borderLeftWidth: 3 }}
                />
                <Box paddingLeft={'m'}>
                  <Box width={10} height={10} />
                </Box>
                <Box flex={0.1} paddingLeft={'m'} />
                <Box
                  flex={0.6}
                  flexDirection="row"
                  paddingLeft={'m'}
                  alignItems={'center'}>
                  <AssetIcon asset={item.code} size={scale(25)} />
                  <Box width={'80%'} paddingLeft="m">
                    <Text
                      numberOfLines={1}
                      variant={'listText'}
                      color="darkGrey">
                      {item.name}
                    </Text>
                  </Box>
                </Box>
                <Box
                  flex={0.45}
                  alignItems="flex-end"
                  justifyContent="flex-end"
                  paddingRight={'s'}>
                  <Text variant={'listText'} color="darkGrey" numberOfLines={1}>
                    {prettyNativeBalance}
                  </Text>
                  <Text
                    variant={'subListText'}
                    color="greyMeta"
                    numberOfLines={1}>
                    {prettyFiatBalance}
                  </Text>
                </Box>
                {!borderWidth ? (
                  <ChevronRight style={styles.chevronRow} />
                ) : null}
              </Box>
            </Pressable>
          </AssetListSwipeableRow>
        </Animated.View>
      )}
    </Fragment>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(70),
  },
  chevronRow: {
    marginLeft: scale(5),
  },
})

export default SubRow

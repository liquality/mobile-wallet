import React, { FC, useCallback, useEffect, useState } from 'react'
import { Image, LayoutChangeEvent, Pressable, StyleSheet } from 'react-native'
import {
  cryptoToFiat,
  formatFiat,
  prettyBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { AccountType } from '../../types'
import AssetIcon from '../asset-icon'
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
import { Box, faceliftPalette, Text } from '../../theme'
import { scale } from 'react-native-size-matters'
import { checkImgUrlExists } from '../../utils'
import { AppIcons } from '../../assets'
import { Path, Svg } from 'react-native-svg'

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
  const [imgError] = useState<string[]>([])
  const [numberOfNfts, setNumberOfNfts] = useState<number>()
  const [borderWidth, setBorderWidth] = useState(0)
  const [rowWidth, setRowWidth] = useState(0)
  const [rowHeight, setRowHeight] = useState(0)

  const { activeWalletId } = wallet.state

  const clearDoubleOrLongTapSelectedAsset = useSetRecoilState(
    doubleOrLongTapSelectedAsset,
  )

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

  const handlePressOnRow = useCallback(() => {
    clearDoubleOrLongTapSelectedAsset('')

    onAssetSelected()
  }, [clearDoubleOrLongTapSelectedAsset, onAssetSelected])

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
      let firstNftItem = chainSpecificNfts[Object.keys(chainSpecificNfts)[0]][0]
      return (
        <Pressable onPress={handlePressOnRow} style={styles.row}>
          <Box
            height={scale(50)}
            width={scale(3)}
            style={{ backgroundColor: item.color }}
          />
          <Box paddingLeft={'m'}>
            <Box width={10} height={10} />
          </Box>
          <Box flex={0.1} paddingLeft={'m'} />
          <Box flex={0.55} flexDirection="row" paddingLeft="m">
            <Image
              source={checkImgUrlExists(
                firstNftItem.image_original_url,
                imgError,
              )}
              style={styles.nftImg}
              onError={() => imgError.push(firstNftItem.image_original_url)}
            />
            <Box width={'80%'} paddingLeft="m">
              <Text numberOfLines={1} variant={'listText'} color="darkGrey">
                NFT <Text color="mediumGrey">|</Text> {numberOfNfts}{' '}
              </Text>
            </Box>
          </Box>
          <Box
            flex={0.45}
            alignItems={'flex-end'}
            justifyContent="flex-end"
            paddingLeft={'s'}>
            <Text variant={'listText'} color="darkGrey" numberOfLines={1}>
              See All <ChevronRight style={styles.chevronNft} />
            </Text>
          </Box>
        </Pressable>
      )
    } else return null
  }

  return (
    <Box>
      {nft ? (
        renderNFTRow()
      ) : (
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
              paddingVertical={'m'}
              height={70}
              backgroundColor={
                borderWidth ? 'selectedBackgroundColor' : 'white'
              }
              paddingRight={borderWidth ? 'mxxl' : 's'}
              onLayout={onLayout}>
              {borderWidth ? getBackgroundBox() : null}
              <Box
                height={scale(50)}
                width={scale(3)}
                style={{ borderLeftColor: item.color, borderLeftWidth: 3 }}
              />
              <Box paddingLeft={'m'}>
                <Box width={10} height={10} />
              </Box>
              <Box flex={0.1} paddingLeft={'m'} />
              <Box flex={0.6} flexDirection="row" paddingLeft={'m'}>
                <AssetIcon asset={item.code} />
                <Box width={'80%'} paddingLeft="m">
                  <Text numberOfLines={1} variant={'listText'} color="darkGrey">
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
                <ChevronRight style={(styles.chevronNft, styles.chevronRow)} />
              ) : null}
            </Box>
          </Pressable>
        </AssetListSwipeableRow>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    height: scale(60),
  },
  nftImg: {
    marginLeft: scale(3),
    marginRight: scale(5),

    width: scale(25),
    height: scale(25),
    borderRadius: 4,
  },
  chevronNft: {
    marginTop: scale(13),
  },
  chevronRow: {
    marginTop: scale(13),
    marginLeft: scale(5),
  },
})

export default SubRow

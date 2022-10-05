import React, { FC, useCallback, useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
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
  addressStateFamily,
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
  const address = useRecoilValue(addressStateFamily(item.id))
  const fiatRates = useRecoilValue(fiatRatesState)
  const activeNetwork = useRecoilValue(networkState)
  const [chainSpecificNfts, setChainSpecificNfts] = useState({})
  const [accountIdsToSendIn] = useState<string[]>([])

  const { activeWalletId } = wallet.state

  const clearDoubleOrLongTapSelectedAsset = useSetRecoilState(
    doubleOrLongTapSelectedAsset,
  )

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
      let nfts = await getNftsForAccount(parentItem.id)
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
    if (Object.keys(chainSpecificNfts).length > 0)
      return (
        <View>
          <Pressable
            onPress={handlePressOnRow}
            style={[
              styles.row,
              styles.subElement,
              { borderLeftColor: parentItem.color },
            ]}>
            <Text>NFT</Text>
          </Pressable>
        </View>
      )
    else return null
  }

  return (
    <View>
      {nft ? (
        renderNFTRow()
      ) : (
        <AssetListSwipeableRow
          assetData={{
            ...item,
            address: address,
          }}
          assetSymbol={item.code}>
          <Pressable
            onPress={handlePressOnRow}
            style={[styles.row, styles.subElement]}>
            <Box
              height={scale(50)}
              width={scale(3)}
              style={{ backgroundColor: parentItem.color }}
            />
            <Box flex={0.6} flexDirection="row" paddingLeft={'m'}>
              <AssetIcon asset={item.code} />
              <Box width={'80%'}>
                <Text
                  numberOfLines={1}
                  paddingLeft={'s'}
                  variant={'listText'}
                  color="darkGrey">
                  {item.name}
                </Text>
              </Box>
            </Box>
            <Box flex={0.4} alignItems={'flex-end'} paddingLeft={'m'}>
              <Text variant={'listText'} color="darkGrey">
                {prettyNativeBalance}
              </Text>
              <Text variant={'subListText'} color="greyMeta">
                {prettyFiatBalance}
              </Text>
            </Box>
          </Pressable>
        </AssetListSwipeableRow>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    height: scale(60),
  },
  subElement: {
    paddingLeft: scale(15),
  },
})

export default SubRow

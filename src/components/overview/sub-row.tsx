import React, { FC, useCallback, useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
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
import { AppIcons } from '../../assets'

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
      )}
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

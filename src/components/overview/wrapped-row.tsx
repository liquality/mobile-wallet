import React, { FC, Fragment, useCallback, useState } from 'react'
import { AccountType, ActionEnum, MainStackParamList } from '../../types'
import Row from './row'
import SubRow from './sub-row'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  accountForAssetState,
  accountInfoStateFamily,
  addressStateFamily,
  balanceStateFamily,
  enabledAssetsStateFamily,
  isDoneFetchingData,
  networkState,
  swapPairState,
} from '../../atoms'
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/core'
import { OverviewProps } from '../../screens/wallet-features/home/overview-screen'
import AssetIcon from '../asset-icon'
import { getAsset } from '@liquality/cryptoassets'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

const WrappedRow: FC<{
  item: { id: string; name: string }
}> = (props) => {
  const { item } = props

  const [isExpanded, setIsExpanded] = useState(false)
  const ethAccount = useRecoilValue(accountForAssetState('ETH'))
  const btcAccount = useRecoilValue(accountForAssetState('BTC'))
  const address = useRecoilValue(addressStateFamily(item.id))
  const balance = useRecoilValue(
    balanceStateFamily({ asset: item.name, assetId: item.id }),
  )
  const activeNetwork = useRecoilValue(networkState)

  const account = useRecoilValue(accountInfoStateFamily(item.id))
  const isDoneFetching = useRecoilValue(isDoneFetchingData)
  const [swapPair, setSwapPair] = useRecoilState(swapPairState)
  const isAssetEnabled = useRecoilValue(enabledAssetsStateFamily(item.name))
  const assets = Object.values(account?.assets || {}) || []
  const isNested = assets.length > 0 && item.name !== 'BTC'
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()
  const route = useRoute<OverviewProps['route']>()

  const toggleRow = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  const onNFTPress = () => {
    navigation.navigate('NftForSpecificChainScreen', {
      screenTitle: 'NFTs for CODE',
      currentAccount: account as AccountType,
    })
  }

  const onAssetSelected = useCallback(
    (currentAccount: AccountType) => {
      // Make sure account assets have the same id (account id) as their parent
      const selectedAccount: AccountType = {
        ...currentAccount,
        id: account.id || '',
        address,
        balance,
      }

      let fromAsset: AccountType, toAsset: AccountType | undefined
      toAsset = selectedAccount.code === 'ETH' ? btcAccount : ethAccount

      if (route?.params?.action === ActionEnum.SWAP) {
        if (!swapPair.fromAsset && !swapPair.toAsset) {
          fromAsset = selectedAccount
          if (toAsset) {
            setSwapPair({ fromAsset, toAsset })
          }
        } else if (!swapPair.fromAsset) {
          setSwapPair((previousValue) => ({
            ...previousValue,
            fromAsset: selectedAccount,
          }))
        } else {
          setSwapPair((previousValue) => ({
            ...previousValue,
            toAsset: selectedAccount,
          }))
        }

        navigation.navigate('SwapScreen', {
          swapAssetPair: swapPair,
          screenTitle: `${route.params.action} ${item.name}`,
        })
      } else if (route?.params?.action === ActionEnum.SEND) {
        navigation.navigate('SendScreen', {
          assetData: selectedAccount,
          screenTitle: `${route.params.action} ${item.name}`,
        })
      } else if (route?.params?.action === ActionEnum.RECEIVE) {
        navigation.navigate('ReceiveScreen', {
          assetData: selectedAccount,
          screenTitle: `${route.params.action} ${item.name}`,
        })
      } else {
        setSwapPair({ fromAsset: selectedAccount, toAsset })
        navigation.navigate({
          name: 'AssetScreen',
          params: {
            ...route.params,
            assetData: selectedAccount,
            includeBackBtn: true,
          },
        })
      }
    },
    [
      account.id,
      address,
      balance,
      btcAccount,
      ethAccount,
      route.params,
      swapPair,
      navigation,
      item.name,
      setSwapPair,
    ],
  )

  if (
    !isAssetEnabled ||
    !account ||
    !account.code ||
    (isDoneFetching && (balance < 0 || !address))
  )
    return null

  if (balance < 0 || !address)
    return (
      <View style={styles.row}>
        <AssetIcon chain={getAsset(activeNetwork, item.name)?.chain} />
        <ActivityIndicator />
      </View>
    )
  return (
    <Fragment key={item.id}>
      <Row
        key={item.id}
        item={account}
        toggleRow={toggleRow}
        onAssetSelected={() => onAssetSelected(account)}
        isNested={isNested}
        isExpanded={isExpanded}
      />
      {isNested && isExpanded && (
        <SubRow
          key={1}
          parentItem={account}
          item={{}}
          onAssetSelected={() => onNFTPress(account)}
          nft={true}
        />
      )}
      {isNested &&
        isExpanded &&
        assets?.map((subItem) => {
          return (
            <SubRow
              key={subItem.id}
              parentItem={account}
              item={subItem}
              onAssetSelected={() => onAssetSelected(subItem)}
            />
          )
        })}
    </Fragment>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 60,
  },
})

export default WrappedRow

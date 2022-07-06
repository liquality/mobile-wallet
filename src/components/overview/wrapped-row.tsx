import React, { FC, Fragment, useCallback, useMemo, useState } from 'react'
import { AccountType, ActionEnum, RootStackParamList } from '../../types'
import Row from './row'
import SubRow from './sub-row'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  accountForAssetState,
  accountInfoStateFamily,
  addressStateFamily,
  balanceStateFamily,
  iDoneFetchingData,
  swapPairState,
} from '../../atoms'
import { useNavigation, useRoute } from '@react-navigation/core'
import { OverviewProps } from '../../screens/wallet-features/home/overview-screen'
import AssetIcon from '../asset-icon'
import { assets as cryptoassets } from '@liquality/cryptoassets'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

const WrappedRow: FC<{
  item: { id: string; name: string }
}> = (props) => {
  const { item } = props
  const [isExpanded, setIsExpanded] = useState(false)
  const ethAccount = useRecoilValue(accountForAssetState('BTC'))
  const btcAccount = useRecoilValue(accountForAssetState('BTC'))
  const address = useRecoilValue(addressStateFamily(item.id))
  const balance = useRecoilValue(balanceStateFamily(item.name))
  const account = useRecoilValue(accountInfoStateFamily(item.id))
  const isDoneFetching = useRecoilValue(iDoneFetchingData)
  const [swapPair, setSwapPair] = useRecoilState(swapPairState)
  const assets = Object.values(account?.assets || {}) || []
  const isNested = assets.length > 0 && item.name !== 'BTC'
  const screenMap: Record<ActionEnum, keyof RootStackParamList> = useMemo(
    () => ({
      [ActionEnum.RECEIVE]: 'ReceiveScreen',
      [ActionEnum.SWAP]: 'SwapScreen',
      [ActionEnum.SEND]: 'SendScreen',
    }),
    [],
  )
  const navigation = useNavigation<OverviewProps['navigation']>()
  const route = useRoute<OverviewProps['route']>()

  const toggleRow = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  const onAssetSelected = useCallback(
    (selectedAccount: AccountType) => {
      // Make sure account assets have the same id (account id) as their parent
      selectedAccount.id = account.id
      selectedAccount.address = account.address
      let fromAsset: AccountType, toAsset: AccountType
      toAsset = selectedAccount.code === 'ETH' ? btcAccount : ethAccount

      if (route?.params?.action === ActionEnum.SWAP) {
        if (!swapPair.fromAsset && !swapPair.toAsset) {
          fromAsset = selectedAccount
          setSwapPair({ fromAsset, toAsset })
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

        navigation.navigate({
          name: screenMap[route.params.action],
          params: {
            swapAssetPair: swapPair,
            screenTitle: `${route.params.action} ${item.name}`,
          },
        })
      } else if (route?.params?.action === ActionEnum.SEND) {
        navigation.navigate({
          name: screenMap[route.params.action],
          params: {
            assetData: selectedAccount,
            screenTitle: `${route.params.action} ${item.name}`,
          },
        })
      } else {
        setSwapPair({ fromAsset: selectedAccount, toAsset })
        navigation.navigate({
          name: 'AssetScreen',
          params: {
            ...route.params,
            assetData: selectedAccount,
          },
        })
      }
    },
    [
      account.address,
      account.id,
      btcAccount,
      ethAccount,
      item.name,
      navigation,
      route.params,
      screenMap,
      setSwapPair,
      swapPair,
    ],
  )

  if (
    !account ||
    !account.code ||
    (isDoneFetching && (balance < 0 || !address))
  )
    return null

  if (balance < 0 || !address)
    return (
      <View style={styles.row}>
        <AssetIcon chain={cryptoassets[item.name].chain} />
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
    alignContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
    borderLeftWidth: 3,
    paddingVertical: 10,
    height: 60,
  },
})

export default WrappedRow

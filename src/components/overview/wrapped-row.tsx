import React, { FC, Fragment, useCallback, useMemo, useState } from 'react'
import { AccountType, ActionEnum, RootStackParamList } from '../../types'
import Row from './row'
import SubRow from './sub-row'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  accountForAssetState,
  accountInfoStateFamily,
  swapPairState,
} from '../../atoms'
import { useNavigation, useRoute } from '@react-navigation/core'
import { OverviewProps } from '../../screens/wallet-features/home/overview-screen'

const WrappedRow: FC<{
  item: { id: string; name: string }
}> = (props) => {
  const { item } = props
  const [isExpanded, setIsExpanded] = useState(false)
  const ethAccount = useRecoilValue(accountForAssetState('ETH'))
  const btcAccount = useRecoilValue(accountForAssetState('BTC'))
  const account = useRecoilValue(accountInfoStateFamily(item.id))
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

  if (!account || !account.code) return null

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

export default WrappedRow

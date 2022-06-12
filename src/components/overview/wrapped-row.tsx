import React, {
  FC,
  Fragment,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { AccountType, ActionEnum, RootStackParamList } from '../../types'
import Row from './row'
import SubRow from './sub-row'
import Box from '../../theme/box'
import Text from '../../theme/text'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  accountInfoStateFamily,
  accountListState,
  swapPairState,
} from '../../atoms'
import { useNavigation, useRoute } from '@react-navigation/core'
import { OverviewProps } from '../../screens/wallet-features/home/overview-screen'

const WrappedRow: FC<{
  item: { id: string; name: string }
}> = (props) => {
  const { item } = props
  const [isExpanded, setIsExpanded] = useState(false)
  const account = useRecoilValue(accountInfoStateFamily(item.id))
  const [swapPair, setSwapPair] = useRecoilState(swapPairState)
  const assets = Object.values(account?.assets || {}) || []
  const accounts = useRecoilValue(accountListState)
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

  // const onAssetSelected = useCallback(
  //   (params: StackPayload) => {
  //     navigation.navigate('AssetScreen', {
  //       ...params,
  //     })
  //   },
  //   [navigation],
  // )

  const onAssetSelected = useCallback(() => {
    let fromAsset: AccountType, toAsset: AccountType
    if (route?.params?.action === ActionEnum.SWAP) {
      //if swapAssetPair is falsy then the user is either coming from the overview or the asset screen, otherwise, the user is coming from the swap screen
      if (!swapPair.fromAsset && !swapPair.toAsset) {
        fromAsset = accounts.filter((asset) => asset.code === 'BTC')[0]
        toAsset = accounts.filter((asset) => asset.code === 'ETH')[0]
        setSwapPair({ fromAsset, toAsset })
      } else if (!swapPair.fromAsset) {
        setSwapPair((previousValue) => ({ ...previousValue, fromAsset }))
      } else {
        setSwapPair((previousValue) => ({ ...previousValue, toAsset }))
      }

      navigation.navigate(screenMap[route.params.action], {
        swapAssetPair: swapPair,
        screenTitle: `${route.params.action} ${item.name}`,
      })
      // if (!route.params.swapAssetPair) {
      //   const fromAsset = params.assetData
      //   let toAsset = params.assetData
      //
      //   if (fromAsset?.code === 'ETH') {
      //     toAsset = assets.filter((asset) => asset.code === 'BTC')[0]
      //   } else {
      //     toAsset = assets.filter((asset) => asset.code === 'ETH')[0]
      //   }
      //   navigation.navigate(screenMap[route.params.action], {
      //     swapAssetPair: {
      //       fromAsset,
      //       toAsset,
      //     },
      //     screenTitle: `${route.params.action} ${params.assetData?.code}`,
      //   })
      // } else {
      //   const swapAssetPair: SwapAssetPairType = route.params.swapAssetPair
      //   if (!route.params.swapAssetPair.toAsset) {
      //     swapAssetPair.toAsset = params.assetData
      //   } else {
      //     swapAssetPair.fromAsset = params.assetData
      //   }
      //   navigation.navigate(screenMap[route.params.action], {
      //     swapAssetPair,
      //     screenTitle: `${route.params.action} ${params.assetData?.code}`,
      //   })
      // }
    } else if (route?.params?.action === ActionEnum.SEND) {
      if (account)
        navigation.navigate(screenMap[route.params.action], {
          assetData: account,
          screenTitle: `${route.params.action} ${item.name}`,
        })
    } else {
      navigation.navigate('AssetScreen', {
        ...route.params,
        assetData: account,
      })
    }
  }, [
    account,
    accounts,
    item.name,
    navigation,
    route.params,
    screenMap,
    setSwapPair,
    swapPair,
  ])

  if (!account)
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    )
  return (
    <Fragment key={item.id}>
      <Row
        key={item.id}
        item={account}
        toggleRow={toggleRow}
        onAssetSelected={onAssetSelected}
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
              onAssetSelected={onAssetSelected}
            />
          )
        })}
    </Fragment>
  )
}

export default memo(WrappedRow)
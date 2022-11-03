import { useEffect } from 'react'
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  accountsIdsState,
  accountsIdsForMainnetState,
  isDoneFetchingData,
  langSelected as LS,
  networkState,
  historyItemsState,
  showFilterState,
  allNftsState,
} from '../../atoms'
import {
  getAllEnabledAccounts,
  populateWallet,
  updateNFTs,
} from '../../store/store'
import ActivityFlatList from '../activity-flat-list'
import AssetFlatList from './asset-flat-list'
import * as React from 'react'
import { downloadAssetAcitivity, labelTranslateFn, Log } from '../../utils'
import {
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native'
import {
  TabView,
  SceneRendererProps,
  NavigationState,
  Route,
} from 'react-native-tab-view'
import i18n from 'i18n-js'
import {
  Box,
  OVERVIEW_TAB_BAR_STYLE,
  OVERVIEW_TAB_STYLE,
  TabBar,
  Text,
} from '../../theme'
import { Network } from '@liquality/wallet-core/dist/src/store/types'
import { scale } from 'react-native-size-matters'
import { AppIcons } from '../../assets'

import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions' // Default options

const wallet = setupWallet({
  ...defaultOptions,
})

const { Filter, ExportIcon } = AppIcons

type RenderTabBar = SceneRendererProps & {
  navigationState: NavigationState<Route>
}

const ContentBlock = () => {
  const network = useRecoilValue(networkState)
  const accountsIds = useRecoilValue(
    network === Network.Testnet ? accountsIdsState : accountsIdsForMainnetState,
  )
  const setIsDoneFetchingData = useSetRecoilState(isDoneFetchingData)
  const [delayTabView, setDelayTabView] = React.useState(false)
  const langSelected = useRecoilValue(LS)
  const setShowFilter = useSetRecoilState(showFilterState)
  const activeNetwork = useRecoilValue(networkState)
  //const allNfts = useRecoilValue(allNftsState)
  //console.log(allNfts, 'ALL NFTS in state ')

  const { activeWalletId } = wallet.state
  const addAllNfts = useRecoilCallback(
    ({ set }) =>
      (iterableNftArr: NFTWithAccount[][]) => {
        set(allNftsState, iterableNftArr)
      },
  )

  i18n.locale = langSelected
  useEffect(() => {
    setIsDoneFetchingData(false)
    const enabledAccountsToSendIn = getAllEnabledAccounts()
    const accIds = enabledAccountsToSendIn.map((account) => {
      return account.id
    })

    populateWallet(accIds)
      .then(() => {
        setIsDoneFetchingData(true)
      })
      .catch((e) => {
        setIsDoneFetchingData(true)
        Log(`Failed to populateWallet: ${e}`, 'error')
      })
  }, [setIsDoneFetchingData, accountsIds, network])

  useEffect(() => {
    // Issue is if UI is not loaded completely and user tap on tabBar then the tabView get stuck
    // workaround to avoid tab view stuck issue,
    setTimeout(() => {
      setDelayTabView(true)
    }, 0)
  }, [])

  useEffect(() => {
    async function fetchData() {
      /*      const enabledAccountsToSendIn = getAllEnabledAccounts()
      const accIds = enabledAccountsToSendIn.map((account) => {
        return account.id
      })
      //setAccountIds(accIds)
      await updateNFTs({
        walletId: activeWalletId,
        network: activeNetwork,
        accountIds: accIds,
      })

      //Use dummydata here if no assets load
      let allNfts = await fetchAllNfts()
      //setAllNftData(allNfts)
      let wholeNftArr = Object.values(allNfts).map((val) => {
        return val
      }) */
      fetchAllNfts()
      console.log(
        Object.keys(wallet.getters.allNftCollections).length,
        'Wat is length?',
      )
      if (Object.keys(wallet.getters.allNftCollections).length === 0) {
        console.log('Inside if because length is 0')
        setTimeout(() => {}, 2000)
        fetchAllNfts()
      }

      //addAllNfts(wholeNftArr)
    }
    fetchData()
  }, [activeWalletId, activeNetwork])

  const fetchAllNfts = async () => {
    const enabledAccountsToSendIn = getAllEnabledAccounts()
    const accIds = enabledAccountsToSendIn.map((account) => {
      return account.id
    })

    await updateNFTs({
      walletId: activeWalletId,
      network: activeNetwork,
      accountIds: accIds,
    })

    //Use dummydata here if no assets load

    let allNfts = await wallet.getters.allNftCollections
    //setAllNftData(allNfts)
    let wholeNftArr = Object.values(allNfts).map((val) => {
      return val
    })
    console.log(wholeNftArr, 'WHOLE NFT ARR?')
  }

  const historyItem = useRecoilValue(historyItemsState)

  const layout = useWindowDimensions()
  const [index, setIndex] = React.useState(0)
  const [routes, setRoutes] = React.useState([
    { key: 'asset', title: labelTranslateFn('asset')! },
    { key: 'activity', title: labelTranslateFn('activity')! },
  ])

  useEffect(() => {
    setRoutes([
      { key: 'asset', title: labelTranslateFn('asset')! },
      { key: 'activity', title: labelTranslateFn('activity')! },
    ])
  }, [langSelected])

  // workaround to avoid tab view stuck issue
  if (!delayTabView) {
    return (
      <Box flex={1} justifyContent="center">
        <ActivityIndicator />
      </Box>
    )
  }

  const onExportIconPress = async () => {
    try {
      await downloadAssetAcitivity(historyItem)
    } catch (error) {}
  }

  const renderTabBar = (props: RenderTabBar) => (
    // Redline because of theme issue with TabBar props
    <Box>
      <TabBar
        {...props}
        renderLabel={({ route, focused }) => (
          <Text
            variant={'tabLabel'}
            color={focused ? 'tablabelActiveColor' : 'tablabelInactiveColor'}>
            {route.title}
          </Text>
        )}
        tabStyle={OVERVIEW_TAB_BAR_STYLE}
        variant="light"
        style={OVERVIEW_TAB_STYLE}
      />
      {props.navigationState.index && historyItem.length ? (
        <Box width={'20%'} position={'absolute'} zIndex={100} top={0} right={0}>
          <Box
            flexDirection={'row'}
            height={scale(40)}
            justifyContent="space-between"
            alignItems="center">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowFilter((old) => !old)}>
              <Filter />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onExportIconPress()}>
              <ExportIcon />
            </TouchableOpacity>
          </Box>
        </Box>
      ) : null}
    </Box>
  )

  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={({ route }) => {
        switch (route.key) {
          case 'asset':
            return <AssetFlatList accounts={accountsIds} />
          case 'activity':
            return <ActivityFlatList historyCount={historyItem.length} />
        }
      }}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width - scale(30) }} //approx to horizontal patting
      sceneContainerStyle={{
        marginTop: scale(15),
      }}
    />
  )
}

export default ContentBlock

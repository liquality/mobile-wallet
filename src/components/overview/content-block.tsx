import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  accountsIdsState,
  accountsIdsForMainnetState,
  isDoneFetchingData,
  langSelected as LS,
  networkState,
} from '../../atoms'
import { populateWallet } from '../../store/store'
import ActivityFlatList from '../activity-flat-list'
import AssetFlatList from './asset-flat-list'
import * as React from 'react'
import { labelTranslateFn, Log } from '../../utils'
import { useWindowDimensions } from 'react-native'
import {
  TabView,
  SceneRendererProps,
  NavigationState,
  Route,
} from 'react-native-tab-view'
import i18n from 'i18n-js'
import {
  OVERVIEW_TAB_BAR_STYLE,
  OVERVIEW_TAB_STYLE,
  TabBar,
  Text,
} from '../../theme'
import { Network } from '@liquality/wallet-core/dist/src/store/types'
import { scale } from 'react-native-size-matters'

type RenderTabBar = SceneRendererProps & {
  navigationState: NavigationState<Route>
}

const ContentBlock = () => {
  const network = useRecoilValue(networkState)
  const accountsIds = useRecoilValue(
    network === Network.Testnet ? accountsIdsState : accountsIdsForMainnetState,
  )
  const setIsDoneFetchingData = useSetRecoilState(isDoneFetchingData)
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected
  useEffect(() => {
    setIsDoneFetchingData(false)
    populateWallet()
      .then(() => {
        setIsDoneFetchingData(true)
      })
      .catch((e) => {
        setIsDoneFetchingData(true)
        Log(`Failed to populateWallet: ${e}`, 'error')
      })
  }, [setIsDoneFetchingData, accountsIds, network])

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

  const renderTabBar = (props: RenderTabBar) => (
    // Redline because of theme issue with TabBar props
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
            return <ActivityFlatList />
          default:
            return null
        }
      }}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      sceneContainerStyle={{
        marginTop: scale(15),
      }}
    />
  )
}

export default ContentBlock

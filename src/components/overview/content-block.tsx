import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  accountsIdsState,
  isDoneFetchingData,
  langSelected as LS,
} from '../../atoms'
import { populateWallet, storageManager } from '../../store/store'
import { StyleSheet } from 'react-native'
import { palette } from '../../theme'
import ActivityFlatList from '../activity-flat-list'
import AssetFlatList from './asset-flat-list'
import * as React from 'react'
import { labelTranslateFn, Log } from '../../utils'
import { useWindowDimensions } from 'react-native'
import {
  TabView,
  TabBar,
  SceneRendererProps,
  NavigationState,
  Route,
} from 'react-native-tab-view'
import i18n from 'i18n-js'

type RenderTabBar = SceneRendererProps & {
  navigationState: NavigationState<Route>
}

const ContentBlock = () => {
  const accountsIds = useRecoilValue(accountsIdsState)
  const setIsDoneFetchingData = useSetRecoilState(isDoneFetchingData)
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected
  useEffect(() => {
    const result = storageManager.read<string | null>(
      `${accountsIds[0].name}|${accountsIds[0].id}`,
      '',
    )
    if (result !== null && result) {
      populateWallet()
        .then(() => {
          setIsDoneFetchingData(true)
        })
        .catch((e) => {
          Log(`Failed to populateWallet: ${e}`, 'error')
        })
    } else {
      setIsDoneFetchingData(true)
    }
  }, [setIsDoneFetchingData, accountsIds])

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
    <TabBar
      {...props}
      indicatorStyle={styles.indicatorStyle}
      style={styles.tabBarBackgroundStyle}
      labelStyle={styles.labelStyle}
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
    />
  )
}

const styles = StyleSheet.create({
  indicatorStyle: {
    backgroundColor: palette.black2,
    height: 1,
  },
  tabBarBackgroundStyle: {
    backgroundColor: palette.white,
  },
  labelStyle: {
    color: palette.black2,
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
})

export default ContentBlock

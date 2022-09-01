import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { accountsIdsState, isDoneFetchingData } from '../../atoms'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { populateWallet } from '../../store/store'
import { StyleSheet } from 'react-native'
import { palette } from '../../theme'
import ActivityFlatList from '../activity-flat-list'
import AssetFlatList from './asset-flat-list'
import * as React from 'react'
import { Log } from '../../utils'
import { useWindowDimensions } from 'react-native'
import {
  TabView,
  TabBar,
  SceneRendererProps,
  NavigationState,
  Route,
} from 'react-native-tab-view'

type RenderTabBar = SceneRendererProps & {
  navigationState: NavigationState<Route>
}

const ContentBlock = () => {
  const accountsIds = useRecoilValue(accountsIdsState)
  const setIsDoneFetchingData = useSetRecoilState(isDoneFetchingData)

  useEffect(() => {
    AsyncStorage.getItem(`${accountsIds[0].name}|${accountsIds[0].id}`).then(
      (result) => {
        if (result !== null) {
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
      },
    )
  }, [setIsDoneFetchingData, accountsIds])

  const layout = useWindowDimensions()
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'asset', title: 'Assets' },
    { key: 'activity', title: 'Activity' },
  ])

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

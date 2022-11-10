import * as React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  isDoneFetchingData,
  langSelected as LS,
  networkState,
  historyItemsState,
  activityFilterState,
} from '../../atoms'
import { getAllEnabledAccounts, populateWallet } from '../../store/store'
import ActivityFlatList from '../activity-flat-list'
import AssetFlatList from './asset-flat-list'
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
import { scale } from 'react-native-size-matters'
import { AppIcons } from '../../assets'
import { NavigationProp, useNavigation } from '@react-navigation/core'
import { MainStackParamList } from '../../types'

const { Filter, ExportIcon } = AppIcons

type RenderTabBar = SceneRendererProps & {
  navigationState: NavigationState<Route>
}

const ContentBlock = () => {
  const network = useRecoilValue(networkState)
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()

  const setIsDoneFetchingData = useSetRecoilState(isDoneFetchingData)
  const [delayTabView, setDelayTabView] = React.useState(false)
  const langSelected = useRecoilValue(LS)
  const [assetFilter, setAssetFilter] = useRecoilState(activityFilterState)

  i18n.locale = langSelected

  const handleUpdateFilter = React.useCallback(
    (payload: any) => {
      setAssetFilter((currVal) => ({ ...currVal, ...payload }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assetFilter],
  )

  const handlePickSorter = React.useCallback(() => {
    handleUpdateFilter({ sorter: 'by_date' })
  }, [handleUpdateFilter])

  React.useEffect(() => {
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
  }, [setIsDoneFetchingData, network])

  React.useEffect(() => {
    // Issue is if UI is not loaded completely and user tap on tabBar then the tabView get stuck
    // workaround to avoid tab view stuck issue,
    setTimeout(() => {
      setDelayTabView(true)
    }, 0)
    handlePickSorter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const historyItem = useRecoilValue(historyItemsState)

  const layout = useWindowDimensions()
  const [index, setIndex] = React.useState(0)
  const [routes, setRoutes] = React.useState([
    { key: 'asset', title: labelTranslateFn('asset')! },
    { key: 'activity', title: labelTranslateFn('activity')! },
  ])

  React.useEffect(() => {
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
              onPress={() => navigation.navigate('ActivityFilterScreen', {})}>
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
      lazy
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={({ route }) => {
        switch (route.key) {
          case 'asset':
            return <AssetFlatList />
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

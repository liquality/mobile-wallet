import * as React from 'react'
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'
import ErrorBoundary from 'react-native-error-boundary'
import ErrorFallback from '../../../components/error-fallback'
import { Box, Text } from '../../../theme'
import GradientBackground from '../../../components/gradient-background'
import SummaryBlock from '../../../components/overview/summary-block'
import ContentBlock from '../../../components/overview/content-block'
import HandleLockWalletAndBackgroundTasks from '../../../components/handle-lock-wallet-and-background-tasks'
import { populateWallet } from '../../../store/store'
import RefreshIndicator from '../../../components/refresh-indicator'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useHeaderHeight } from '@react-navigation/elements'
import { GRADIENT_BACKGROUND_HEIGHT } from '../../../utils'

export type OverviewProps = NativeStackScreenProps<
  RootStackParamList,
  'OverviewScreen'
>

const OverviewScreen = ({ navigation }: OverviewProps) => {
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    populateWallet().then(() => setRefreshing(false))
  }, [])

  const { height } = useWindowDimensions()
  const tabBarBottomHeight = useBottomTabBarHeight()
  const headerHeight = useHeaderHeight()
  return (
    <Box flex={1}>
      {refreshing && (
        <RefreshIndicator
          position={'absolute'}
          top={15}
          variant={'refreshContainer'}
        />
      )}
      <ScrollView
        scrollEnabled
        refreshControl={
          <RefreshControl
            tintColor="transparent"
            colors={['transparent']}
            style={styles.indicatorBackgroundColor}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <HandleLockWalletAndBackgroundTasks />
          <React.Suspense
            fallback={
              <Box style={styles.overviewBlock}>
                <GradientBackground
                  width={Dimensions.get('screen').width}
                  height={GRADIENT_BACKGROUND_HEIGHT}
                />
                <Text variant="loading" tx="overviewScreen.load" />
              </Box>
            }>
            <SummaryBlock navigation={navigation} />
          </React.Suspense>
          <Box
            height={
              height -
              tabBarBottomHeight -
              headerHeight -
              GRADIENT_BACKGROUND_HEIGHT
            }>
            <ContentBlock />
          </Box>
        </ErrorBoundary>
      </ScrollView>
    </Box>
  )
}

const styles = StyleSheet.create({
  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: GRADIENT_BACKGROUND_HEIGHT,
    paddingVertical: 10,
  },
  indicatorBackgroundColor: {
    backgroundColor: 'transparent',
  },
})

export default OverviewScreen

import * as React from 'react'
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import ErrorBoundary from 'react-native-error-boundary'
import ErrorFallback from '../../../components/error-fallback'
import { Box, Text } from '../../../theme'
import SummaryBlock from '../../../components/overview/summary-block'
import ContentBlock from '../../../components/overview/content-block'
import HandleLockWalletAndBackgroundTasks from '../../../components/handle-lock-wallet-and-background-tasks'
import {
  getAllEnabledAccounts,
  populateWallet,
  updateNFTs,
} from '../../../store/store'
import RefreshIndicator from '../../../components/refresh-indicator'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useHeaderHeight } from '@react-navigation/elements'
import { GRADIENT_BACKGROUND_HEIGHT } from '../../../utils'

import { scale } from 'react-native-size-matters'
import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'

export type OverviewProps = NativeStackScreenProps<
  MainStackParamList,
  'OverviewScreen'
>

const wallet = setupWallet({
  ...defaultOptions,
})
const OverviewScreen = ({ navigation }: OverviewProps) => {
  const [refreshing, setRefreshing] = React.useState(false)
  const [accountIds, setAccountIds] = React.useState<string[]>([])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    populateWallet(accountIds).then(() => setRefreshing(false))
  }, [accountIds])

  const activeNetwork = useRecoilValue(networkState)

  const { activeWalletId } = wallet.state

  const { height } = useWindowDimensions()
  const tabBarBottomHeight = useBottomTabBarHeight()
  const headerHeight = useHeaderHeight()

  React.useEffect(() => {
    async function fetchData() {
      const enabledAccountsToSendIn = getAllEnabledAccounts()
      const accIds = enabledAccountsToSendIn.map((account) => {
        return account.id
      })
      setAccountIds(accIds)
      await updateNFTs({
        walletId: activeWalletId,
        network: activeNetwork,
        accountIds: accIds,
      })
    }
    fetchData()
  }, [activeWalletId, activeNetwork])

  return (
    <Box flex={1} backgroundColor="mainBackground">
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
                <Text variant="loading" tx="overviewScreen.load" />
              </Box>
            }>
            <SummaryBlock navigation={navigation} />
          </React.Suspense>
          <Box
            zIndex={-1}
            marginTop={'l'}
            height={
              height -
              tabBarBottomHeight -
              headerHeight -
              GRADIENT_BACKGROUND_HEIGHT -
              scale(15) // marginTop usage minus
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

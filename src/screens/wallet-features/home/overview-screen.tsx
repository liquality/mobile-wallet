import * as React from 'react'
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'
import ErrorBoundary from 'react-native-error-boundary'
import Text from '../../../theme/text'
import ErrorFallback from '../../../components/error-fallback'
import Box from '../../../theme/box'
import GradientBackground from '../../../components/gradient-background'
import SummaryBlock from '../../../components/overview/summary-block'
import ContentBlock from '../../../components/overview/content-block'
import HandleLockWalletAndBackgroundTasks from '../../../components/handle-lock-wallet-and-background-tasks'
import { populateWallet } from '../../../store/store'
import RefreshIndicator from '../../../components/refresh-indicator'
import { doubleOrLongTapSelectedAsset } from '../../../atoms'
import { useSetRecoilState } from 'recoil'

export type OverviewProps = NativeStackScreenProps<
  RootStackParamList,
  'OverviewScreen'
>

const OverviewScreen = ({ navigation }: OverviewProps) => {
  const [refreshing, setRefreshing] = React.useState(false)

  const clearDoubleOrLongTapSelectedAsset = useSetRecoilState(
    doubleOrLongTapSelectedAsset,
  )

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    populateWallet().then(() => setRefreshing(false))
  }, [])

  return (
    <Box flex={1}>
      {refreshing && (
        <Box
          position={'absolute'}
          alignItems="center"
          justifyContent={'center'}
          height={60}
          width={'100%'}>
          <RefreshIndicator variant={'refreshContainer'} />
        </Box>
      )}
      <TouchableWithoutFeedback
        onPress={() => clearDoubleOrLongTapSelectedAsset('')}>
        <Box flex={1}>
          <ScrollView
            contentContainerStyle={styles.contentContainerStyle}
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
                      height={225}
                    />
                    <Text variant="loading" tx="overviewScreen.load" />
                  </Box>
                }>
                <SummaryBlock navigation={navigation} />
              </React.Suspense>
              <ContentBlock />
            </ErrorBoundary>
          </ScrollView>
        </Box>
      </TouchableWithoutFeedback>
    </Box>
  )
}

const styles = StyleSheet.create({
  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    paddingVertical: 10,
  },
  contentContainerStyle: {
    flex: 1,
  },
  indicatorBackgroundColor: {
    backgroundColor: 'transparent',
  },
})

export default OverviewScreen

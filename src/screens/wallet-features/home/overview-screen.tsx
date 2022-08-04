import * as React from 'react'
import { Dimensions, StyleSheet } from 'react-native'
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

export type OverviewProps = NativeStackScreenProps<
  RootStackParamList,
  'OverviewScreen'
>

const OverviewScreen = ({ navigation }: OverviewProps) => {
  return (
    <Box flex={1}>
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
        <React.Suspense
          fallback={
            <Box>
              <Text variant="loading" tx="overviewScreen.load" />
            </Box>
          }>
          <ContentBlock />
        </React.Suspense>
      </ErrorBoundary>
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
})

export default OverviewScreen

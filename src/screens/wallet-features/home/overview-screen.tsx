import * as React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'
import ErrorBoundary from 'react-native-error-boundary'
import Text from '../../../theme/text'
import ErrorFallback from '../../../components/error-fallback'
import Box from '../../../theme/box'
import GradientBackground from '../../../components/gradient-background'
import SummaryBlock from '../../../components/overview/summary-block'
import ContentBlock from '../../../components/overview/content-block'

export type OverviewProps = NativeStackScreenProps<
  RootStackParamList,
  'OverviewScreen'
>

const OverviewScreen = ({ navigation }: OverviewProps) => {
  return (
    <View style={styles.container}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <React.Suspense
          fallback={
            <Box style={styles.overviewBlock}>
              <GradientBackground
                width={Dimensions.get('screen').width}
                height={225}
              />
              <Text style={styles.loading}>Loading...</Text>
            </Box>
          }>
          <SummaryBlock navigation={navigation} />
        </React.Suspense>
        <React.Suspense
          fallback={
            <View>
              <Text>Loading...</Text>
            </View>
          }>
          <ContentBlock />
        </React.Suspense>
      </ErrorBoundary>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    paddingVertical: 10,
  },
  loading: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 28,
    color: '#FFF',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 15,
    lineHeight: 28,
  },
})

export default OverviewScreen

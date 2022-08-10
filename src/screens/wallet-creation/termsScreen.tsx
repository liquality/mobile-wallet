import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { RootStackParamList } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import ButtonFooter from '../../components/button-footer'
import Header from '../header'
import Button from '../../theme/button'
import Box from '../../theme/box'
import GradientBackground from '../../components/gradient-background'
import AnalyticsModal from './optInAnalyticsModal'
import { Text } from '../../components/text/text'

type TermsProps = NativeStackScreenProps<RootStackParamList, 'TermsScreen'>

const TermsScreen = ({ navigation, route }: TermsProps) => {
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)

  return (
    <Box style={styles.container}>
      <GradientBackground
        width={Dimensions.get('screen').width}
        height={Dimensions.get('screen').height}
        isFullPage
      />
      <Header showText={true} />
      <View style={styles.containerWrapper}>
        <Text style={styles.termsTitle} tx="termsScreen.termPrivacy" />

        <ScrollView
          contentContainerStyle={styles.termsSection}
          scrollEventThrottle={1000}
          /*
          No mandatory scrolling to activate button,
          but keeping the code if we need it in the future again
          onScroll={({ nativeEvent }) => {
            if (
              !scrolledToEnd &&
              Math.floor(
                nativeEvent.contentOffset.y +
                  nativeEvent.layoutMeasurement.height,
              ) >= Math.floor(nativeEvent.contentSize.height)
            ) {
              setScrolledToEnd(true)
            }
          }} */
        >
          <Text style={styles.termsCopy} tx="termsScreen.termCopy" />
        </ScrollView>
        <ButtonFooter unpositioned>
          <Button
            type="secondary"
            variant="m"
            label={{ tx: 'termsScreen.cancel' }}
            onPress={navigation.goBack}
            isBorderless={false}
            isActive={true}
          />
          <Button
            type="primary"
            variant="m"
            label={{ tx: 'termsScreen.iAccept:' }}
            onPress={() => setShowAnalyticsModal(true)}
            isBorderless={true}
            //isActive={scrolledToEnd}
          />
        </ButtonFooter>
        {showAnalyticsModal ? (
          <React.Suspense
            fallback={
              <View>
                <Text tx="common.loading" />
              </View>
            }>
            <AnalyticsModal
              nextScreen={route?.params?.nextScreen || 'UnlockWalletScreen'}
              onAction={setShowAnalyticsModal}
            />
          </React.Suspense>
        ) : null}
      </View>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  containerWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
    paddingBottom: 20,
  },
  termsSection: {
    paddingBottom: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  termsTitle: {
    fontFamily: 'Montserrat-Regular',
    marginTop: 20,
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
  },
  termsCopy: {
    fontFamily: 'Montserrat-Regular',
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: 'center',
    lineHeight: 20,
    textAlign: 'justify',
  },
})
export default TermsScreen

import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { RootStackParamList } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import ButtonFooter from '../../components/button-footer'
import Header from '../header'
import Button from '../../theme/button'
import Box from '../../theme/box'
import GradientBackground from '../../components/gradient-background'
type TermsProps = NativeStackScreenProps<RootStackParamList, 'TermsScreen'>

const TermsScreen = ({ navigation, route }: TermsProps) => {
  const [scrolledToEnd, setScrolledToEnd] = useState(false)

  return (
    <Box style={styles.container}>
      <GradientBackground
        width={Dimensions.get('screen').width}
        height={Dimensions.get('screen').height}
        isFullPage
      />
      <Header showText={true} />
      <View style={styles.containerWrapper}>
        <ScrollView
          contentContainerStyle={styles.termsSection}
          scrollEventThrottle={1000}
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
          }}>
          <Text style={styles.termsTitle}>Terms & Privacy</Text>
          <Text style={styles.termsCopy}>
            THIS IS THE BETA VERSION OF THE LIQUALITY PLATFORM WHICH IS STILL
            BEING ACTIVELY DEVELOPED. YOU ACKNOWLEDGE THE INFORMATION AVAILABLE
            IS NOT INTENDED TO BE RELIED ON OR USED IN A PRODUCTION ENVIRONMENT.
            YOU ACKNOWLEDGE AND ACCEPT THAT THE SITE OR SERVICES (A) MAY CONTAIN
            BUGS, ERRORS, AND DEFECTS, (B) MAY FUNCTION IMPROPERLY OR BE SUBJECT
            TO PERIODS OF DOWNTIME AN UNAVAILABILITY, (C) MAY RESULT IN TOTAL OR
            PARTIAL LOSS OR CORRUPTION OF DATA USED IN THE SITE, AND (D) MAY BE
            MODIFIED AT ANY TIME, INCLUDING THROUGH THE RELEASE OF SUBSEQUENT
            VERSIONS, ALL WITH OR WITHOUT NOTICE. THE ALPHA PLATFORM IS
            AVAILABLE ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR THE SOLE
            PURPOSE OF COLLECTING FEEDBACK ON QUALITY, USABILITY, PERFORMANCE
            AND ANY DEFECTS. THANK YOU FOR YOUR SUPPORT WHILE WE CONTINUE TO
            WORK ON DELIVERING A PERFECT PRODUCT. THIS IS THE BETA VERSION OF
            THE LIQUALITY PLATFORM WHICH IS STILL BEING ACTIVELY DEVELOPED. YOU
            ACKNOWLEDGE THE INFORMATION AVAILABLE IS NOT INTENDED TO BE RELIED
            ON OR USED IN A PRODUCTION ENVIRONMENT. YOU ACKNOWLEDGE AND ACCEPT
            THAT THE SITE OR SERVICES (A) MAY CONTAIN BUGS, ERRORS, AND DEFECTS,
            (B) MAY FUNCTION IMPROPERLY OR BE SUBJECT TO PERIODS OF DOWNTIME AN
            UNAVAILABILITY, (C) MAY RESULT IN TOTAL OR PARTIAL LOSS OR
            CORRUPTION OF DATA USED IN THE SITE, AND (D) MAY BE MODIFIED AT ANY
            TIME, INCLUDING THROUGH THE RELEASE OF SUBSEQUENT VERSIONS, ALL WITH
            OR WITHOUT NOTICE. THE ALPHA PLATFORM IS AVAILABLE ON AN “AS IS” AND
            “AS AVAILABLE” BASIS FOR THE SOLE PURPOSE OF COLLECTING FEEDBACK ON
            QUALITY, USABILITY, PERFORMANCE AND ANY DEFECTS. THANK YOU FOR YOUR
            SUPPORT WHILE WE CONTINUE TO WORK ON DELIVERING A PERFECT PRODUCT.
          </Text>
        </ScrollView>
        <ButtonFooter unpositioned>
          <Button
            type="secondary"
            variant="m"
            label="Cancel"
            onPress={navigation.goBack}
            isBorderless={false}
            isActive={true}
          />
          <Button
            type="primary"
            variant="m"
            label="I Accept"
            onPress={() =>
              navigation.navigate(
                route?.params?.nextScreen || 'UnlockWalletScreen',
                {
                  termsAcceptedAt: Date.now(),
                  previousScreen: 'Entry',
                },
              )
            }
            isBorderless={true}
            isActive={scrolledToEnd}
          />
        </ButtonFooter>
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
    fontWeight: '400',
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

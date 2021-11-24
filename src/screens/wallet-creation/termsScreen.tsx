import React, { useContext, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
} from 'react-native'
import { RootStackParamList } from '../../types'
import { StackScreenProps } from '@react-navigation/stack'
import { ThemeContext } from '../../theme'
import ButtonFooter from '../../components/button-footer'
import Header from '../header'
type TermsProps = StackScreenProps<RootStackParamList, 'TermsScreen'>

const TermsScreen = ({ navigation }: TermsProps) => {
  const [scrolledToEnd, setScrolledToEnd] = useState(false)
  const theme = useContext(ThemeContext)

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/bg/bg.png')}>
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
          <Pressable
            style={[styles.actionBtn, styles.cancelBtn]}
            onPress={() => navigation.goBack()}>
            <Text style={[theme.buttonText, styles.cancelText]}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[
              styles.actionBtn,
              styles.nextBtn,
              !scrolledToEnd && styles.disabled,
            ]}
            disabled={!scrolledToEnd}
            onPress={() =>
              navigation.navigate('PasswordCreationScreen', {
                termsAcceptedAt: Date.now(),
                previousScreen: 'Entry',
                nextScreen: 'SeedPhraseScreen',
              })
            }>
            <Text style={[theme.buttonText, styles.nextText]}>I Accept</Text>
          </Pressable>
        </ButtonFooter>
      </View>
    </ImageBackground>
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
  actionBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#F8FAFF',
    borderColor: '#9D4DFA',
    borderWidth: 1,
    height: 36,
  },
  cancelBtn: {
    backgroundColor: '#F8FAFF',
    borderColor: '#9D4DFA',
  },
  cancelText: {
    color: '#9D4DFA',
  },
  nextBtn: {
    backgroundColor: '#9D4DFA',
    borderColor: '#9D4DFA',
    borderWidth: 1,
    marginLeft: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  nextText: {
    color: '#F8FAFF',
  },
})
export default TermsScreen

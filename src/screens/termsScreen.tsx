import React, { useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  ScrollView,
} from 'react-native'
import { RootStackParamList } from '../types'
import { StackScreenProps } from '@react-navigation/stack'
import { ThemeContext } from '../theme'
import ScreenHeader from './screenHeader'
type TermsProps = StackScreenProps<RootStackParamList, 'TermsScreen'>

const TermsScreen = ({ navigation }: TermsProps) => {
  const theme = useContext(ThemeContext)

  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/bg/bg.png')}>
      <ScreenHeader />

      <ScrollView contentContainerStyle={styles.termsSection}>
        <Text style={styles.termsTitle}>Terms & Privacy</Text>
        <Text style={styles.termsCopy}>
          THIS IS THE BETA VERSION OF THE LIQUALITY PLATFORM WHICH IS STILL
          BEING ACTIVELY DEVELOPED. YOU ACKNOWLEDGE THE INFORMATION AVAILABLE IS
          NOT INTENDED TO BE RELIED ON OR USED IN A PRODUCTION ENVIRONMENT. YOU
          ACKNOWLEDGE AND ACCEPT THAT THE SITE OR SERVICES (A) MAY CONTAIN BUGS,
          ERRORS, AND DEFECTS, (B) MAY FUNCTION IMPROPERLY OR BE SUBJECT TO
          PERIODS OF DOWNTIME AN UNAVAILABILITY, (C) MAY RESULT IN TOTAL OR
          PARTIAL LOSS OR CORRUPTION OF DATA USED IN THE SITE, AND (D) MAY BE
          MODIFIED AT ANY TIME, INCLUDING THROUGH THE RELEASE OF SUBSEQUENT
          VERSIONS, ALL WITH OR WITHOUT NOTICE. THE ALPHA PLATFORM IS AVAILABLE
          ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR THE SOLE PURPOSE OF
          COLLECTING FEEDBACK ON QUALITY, USABILITY, PERFORMANCE AND ANY
          DEFECTS. THANK YOU FOR YOUR SUPPORT WHILE WE CONTINUE TO WORK ON
          DELIVERING A PERFECT PRODUCT.
        </Text>
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, styles.cancelBtn]}
            onPress={() => navigation.goBack()}>
            <Text style={[theme.buttonText, styles.cancelText]}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.nextBtn]}
            onPress={() =>
              navigation.navigate('PasswordCreationScreen', {
                termsAcceptedAt: Date.now(),
              })
            }>
            <Text style={[theme.buttonText, styles.nextText]}>I Accept</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: 'orange',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  termsSection: {
    marginTop: 20,
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
    margin: 20,
    justifyContent: 'center',
    lineHeight: 20,
  },
  actions: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  actionBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#F8FAFF',
    borderColor: '#9D4DFA',
    borderWidth: 1,
    width: 152,
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
  nextText: {
    color: '#F8FAFF',
  },
})
export default TermsScreen

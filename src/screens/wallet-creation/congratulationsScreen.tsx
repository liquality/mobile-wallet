import React, { useEffect } from 'react'
import { View, StyleSheet, Image, Dimensions } from 'react-native'
import { Text } from '../../components/text/text'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import Confetti from '../../components/confetti'
import { Box } from '../../theme'
import GradientBackground from '../../components/gradient-background'
import { Fonts } from '../../assets'

type CongratulationsProps = NativeStackScreenProps<
  RootStackParamList,
  'SeedPhraseConfirmationScreen'
>

const CongratulationsScreen = ({ navigation }: CongratulationsProps) => {
  useEffect(() => {
    setTimeout(
      () =>
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        }),
      3000,
    )
  })

  return (
    <Box style={styles.container}>
      <GradientBackground
        width={Dimensions.get('screen').width}
        height={Dimensions.get('screen').height}
        isFullPage
      />
      <Confetti />
      <View style={styles.message}>
        <Text style={styles.messageText} tx="congratulationsScreen.congrats" />
        <Image
          style={styles.checkmark}
          source={require('../../assets/icons/checkmark.png')}
        />
      </View>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  message: {
    marginTop: 178,
    alignSelf: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontFamily: Fonts.Regular,
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 27,
  },
  checkmark: {
    width: 102,
    height: 102,
    marginTop: 20,
  },
})

export default CongratulationsScreen

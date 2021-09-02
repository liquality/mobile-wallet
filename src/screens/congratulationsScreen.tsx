import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../types'
import Confetti from '../components/confetti'

type CongratulationsProps = StackScreenProps<
  RootStackParamList,
  'SeedPhraseConfirmationScreen'
>

const CongratulationsScreen = ({ navigation }: CongratulationsProps) => {
  useEffect(() => {
    setTimeout(() => navigation.navigate('Entry'), 5000)
  })

  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/bg/bg.png')}>
      <Confetti />
      <View style={styles.message}>
        <Text style={styles.messageText}>Congrats!</Text>
        <Image
          style={styles.checkmark}
          source={require('../assets/icons/checkmark.png')}
        />
      </View>
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
  message: {
    marginTop: 178,
    alignSelf: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: '#fff',
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

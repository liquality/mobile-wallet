import React, { useCallback } from 'react'
import { View, StyleSheet, Dimensions, Pressable } from 'react-native'
import { useNavigation, NavigationProp } from '@react-navigation/core'
import Button from '../../../theme/button'
import Text from '../../../theme/text'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'
import { labelTranslateFn } from '../../../utils'
import ButtonFooter from '../../../components/button-footer'
import Box from '../../../theme/box'
import XIcon from '../../../assets/icons/XPink.svg'
import PointingFinger from '../../../assets/icons/pointingFinger.svg'
import BentArrow from '../../../assets/icons/bentArrow.svg'

const BackupWarningScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'BackupWarningScreen'>
> = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  const handleGotItPress = useCallback(() => {
    navigation.navigate('BackupSeedScreen', {
      quitOverlay: true,
      screenTitle: labelTranslateFn('backupLoginScreen.seedPhrase')!,
    })
  }, [navigation])

  return (
    <View style={styles.container}>
      <Pressable onPress={handleGotItPress} style={styles.XIconStyle}>
        <View>
          <XIcon width={35} height={35} />
        </View>
      </Pressable>
      <View style={styles.textContainer}>
        <Text
          style={styles.tapAndHold}
          tx="overlayTutorial.hiddenForSecurityTapAndHold"
        />
        <Text style={styles.tryIt} tx="overlayTutorial.tryIt" />
        <View style={styles.bentArrow}>
          <BentArrow width={85} height={85} />
        </View>
        <View style={styles.pointingFinger}>
          <PointingFinger width={55} height={55} />
        </View>
      </View>

      <Box style={styles.buttonContainer}>
        <ButtonFooter unpositioned>
          <Button
            type="secondary"
            variant="m"
            label={{ tx: 'overlayTutorial.gotIt' }}
            onPress={handleGotItPress}
            isBorderless={false}
            isActive={true}
          />
        </ButtonFooter>
      </Box>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(192,192,192,0.9)',
    padding: 15,
    position: 'absolute',
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    zIndex: 100,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 130,
  },
  pointingFinger: {
    marginRight: 50,
  },
  bentArrow: {
    marginLeft: 40,
    marginBottom: 10,
  },
  tapAndHold: {
    fontFamily: 'Montserrat-Regular',
    color: '#FF007A',
    fontWeight: '600',
    fontSize: 20,
  },
  tryIt: {
    fontFamily: 'Montserrat-Regular',
    color: '#FF007A',
    fontWeight: '600',
    fontSize: 20,
    marginRight: 240,
    marginTop: 30,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 5,
    right: 165,
  },
  XIconStyle: {
    position: 'absolute',
    top: 35,
    right: 15,
  },
})

export default BackupWarningScreen

import React, { useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'
import ButtonFooter from '../../../components/button-footer'
import Button from '../../../theme/button'
import Eye from '../../../assets/icons/eye.svg'
import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import GradientBackground from '../../../components/gradient-background'
import Box from '../../../theme/box'
import Text from '../../../theme/text'

type BackupSeedScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BackupSeedScreen'
>

const BackupSeedScreen = ({ navigation }: BackupSeedScreenProps) => {
  const [revealedWord, setRevealedWord] = useState(0)

  const wallet = setupWallet({
    ...defaultOptions,
  })

  const fadeAnim = useRef(new Animated.Value(0)).current
  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start()
  }
  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: false,
    }).start()
  }

  const renderSeedWord = ({ item }: { item: { id: number; word: string } }) => {
    return (
      <TouchableOpacity
        onPressOut={() => setRevealedWord(0)}
        onPress={() => onClickToRevealWord(item.id)}
        activeOpacity={1}
        style={styles.missingWordView}>
        <Text style={styles.wordOrderText}>{Number(item.id)}</Text>

        <View style={styles.missingWordText}>
          {revealedWord === item.id ? (
            <Animated.Text
              style={[
                styles.missingWordText,
                {
                  // Bind opacity to animated value
                  opacity: fadeAnim,
                },
              ]}>
              {item.word}
            </Animated.Text>
          ) : (
            <Text style={styles.placeHolderText} tx="backupSeedScreen.hej" />
          )}
        </View>
      </TouchableOpacity>
    )
  }

  const onClickToRevealWord = (wordId: number) => {
    setRevealedWord(wordId)
    fadeIn()
    setTimeout(() => {
      fadeOut()
    }, 2000)
  }

  const seedList = wallet.state.wallets[0].mnemonic.split(' ')
  return (
    <Box style={styles.container}>
      <GradientBackground
        width={Dimensions.get('screen').width}
        height={Dimensions.get('screen').height}
        isFullPage
      />
      <View style={styles.eyeIcon}>
        <Eye width={150} height={150} />
      </View>

      <View style={styles.prompt}>
        <Text style={styles.promptText} tx="backupSeedScreen.yourSeedPhrase" />
        <Text style={styles.description} tx="backupSeedScreen.writeItDown" />
      </View>
      <View style={styles.main}>
        <View style={styles.seedPhrase}>
          <Box flex={1}>
            <View style={styles.seedWordLengthOptions}>
              <Text
                style={styles.explainHidden}
                tx="backupSeedScreen.hidden4Security"
              />
              {/*  
              We might want to implement toggle between 12-24 words in the future, so keeping this code here  
              <Pressable
                onPress={() => setPhraseLength(12)}
                style={[
                  styles.seedWordOptionAction,
                  styles.btnLeftSide,
                  seedPhraseLength === 12 && styles.optionActive,
                ]}>
                <Text style={styles.seedWordOptionText}>12 words</Text>
              </Pressable>
              <Pressable
                onPress={() => setPhraseLength(24)}
                style={[
                  styles.seedWordOptionAction,
                  styles.btnRightSide,
                  seedPhraseLength === 24 && styles.optionActive,
                ]}>
                <Text style={styles.seedWordOptionText}>24 words</Text>
              </Pressable>*/}
            </View>
            <FlatList
              style={styles.flatList}
              numColumns={3}
              showsVerticalScrollIndicator={true}
              data={seedList.map((item, index) => ({
                id: index + 1,
                word: item,
              }))}
              renderItem={renderSeedWord}
              keyExtractor={(item) => `${item.id}`}
              columnWrapperStyle={styles.columnWrapperStyle}
            />
          </Box>
          <Box>
            <ButtonFooter unpositioned>
              <Button
                type="secondary"
                variant="m"
                label={{ tx: 'common.cancel' }}
                onPress={() => navigation.navigate('OverviewScreen', {})}
                isBorderless={false}
                isActive={true}
              />
              <Button
                type="primary"
                variant="m"
                label={{ tx: 'backupSeedScreen.iSaveSeed' }}
                onPress={() => navigation.navigate('OverviewScreen', {})}
                isBorderless={false}
              />
            </ButtonFooter>
          </Box>
        </View>
      </View>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
  },
  eyeIcon: { marginTop: 50, alignItems: 'center' },
  explainHidden: {
    fontFamily: 'Montserrat-Regular',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '500',
  },
  prompt: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
  promptText: {
    fontFamily: 'Montserrat-Regular',
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 28,
  },
  description: {
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 10,
    marginBottom: 18,
    alignSelf: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
  },
  seedPhrase: {
    width: Dimensions.get('window').width,
    flex: 1,
  },
  flatList: {
    marginTop: 5,
    marginHorizontal: 20,
  },
  columnWrapperStyle: {
    marginBottom: 50,
    marginTop: 0,
    justifyContent: 'space-between',
  },
  seedWordLengthOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 5,
  },
  /* We might want to implement toggle between 12-24 words in the future, so keeping these styles here   
  seedWordOptionAction: {
    borderColor: '#D9DFE5',
    borderWidth: 1,
  },
  btnLeftSide: {
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    borderRightWidth: 0,
  },
  btnRightSide: {
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
  },
  optionActive: {
    backgroundColor: '#F0F7F9',
  },
  seedWordOptionText: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  }, */
  missingWordView: {
    flex: 1,
    marginRight: 20,
  },
  placeHolderText: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    fontSize: 8,
    lineHeight: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#2CD2CF',
    width: '100%',
  },
  wordOrderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3D4767',
    marginBottom: 3,
  },
  missingWordText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    lineHeight: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#2CD2CF',
    width: '100%',
  },
})

export default BackupSeedScreen

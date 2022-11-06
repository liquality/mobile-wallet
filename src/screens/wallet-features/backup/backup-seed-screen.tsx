import React, { useState, useRef } from 'react'
import { FlatList, Animated } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList, SeedWordType } from '../../../types'
import { Box, Text, Pressable } from '../../../theme'
import { scale, ScaledSheet } from 'react-native-size-matters'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { setupWallet } from '@liquality/wallet-core'
import { TouchableOpacity } from 'react-native-gesture-handler'

type BackupSeedScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'BackupSeedScreen'
>

const BackupSeedScreen = ({ navigation }: BackupSeedScreenProps) => {
  const wallet = setupWallet({
    ...defaultOptions,
  })
  const seedList = wallet.state.wallets[0].mnemonic.split(' ')
  const [revealedWord, setRevealedWord] = useState(0)

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

  const onClickToRevealWord = (wordId: number) => {
    setRevealedWord(wordId)
    fadeIn()
    setTimeout(() => {
      fadeOut()
    }, 2000)
  }

  const renderSeedWord = ({ item }: { item: SeedWordType }) => {
    const { id, word } = item

    return (
      <Box width={'27%'} marginBottom={'l'}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPressOut={() => setRevealedWord(0)}
          onPress={() => onClickToRevealWord(item.id)}>
          <Text variant={'numberLabel'} color="greyBlack">
            {id}
          </Text>
          {revealedWord === item.id ? (
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text
                lineHeight={scale(20)}
                variant={'seedPhraseLabel'}
                color="textColor">
                {word}
              </Text>
            </Animated.View>
          ) : (
            <Text
              lineHeight={scale(20)}
              variant={'seedPhraseLabel'}
              color="white"
              tx="backupSeedScreen.hej"
            />
          )}
        </TouchableOpacity>
      </Box>
    )
  }

  const onNextPress = () => {
    navigation.navigate('OverviewScreen', {})
  }

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingHorizontal={'onboardingPadding'}>
      <Box flex={0.75}>
        <Box marginTop={'xl'}>
          <Text
            color={'textColor'}
            variant="h1"
            lineHeight={scale(55)}
            tx="backupSeedScreen.yourSeedPhrase"
          />
        </Box>
        <Text
          variant={'onboardingMessage'}
          tx="backupSeedScreen.writeItDown"
          color={'greyBlack'}
        />
        <Box marginTop={'m'} flex={1}>
          <Text
            variant={'subListText'}
            tx="backupSeedScreen.hidden4Security"
            color={'greyBlack'}
          />
          <Box marginTop={'m'}>
            <FlatList
              data={seedList.map((item, index) => ({
                id: index + 1,
                word: item,
              }))}
              columnWrapperStyle={styles.columnWrapperStyle}
              renderItem={renderSeedWord}
              numColumns={3}
              showsVerticalScrollIndicator={false}
            />
          </Box>
        </Box>
      </Box>
      <Box flex={0.25}>
        <Box marginVertical={'xl'}>
          <Pressable
            label={{ tx: 'common.next' }}
            onPress={onNextPress}
            variant="solid"
            icon
          />
        </Box>
        <Text
          onPress={navigation.popToTop}
          textAlign={'center'}
          variant="link"
          tx="termsScreen.cancel"
        />
      </Box>
    </Box>
  )
}

const styles = ScaledSheet.create({
  columnWrapperStyle: {
    marginBottom: '20@s',
    justifyContent: 'space-between',
  },
})

export default BackupSeedScreen

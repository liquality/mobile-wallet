import React, { FC, useEffect } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import {
  Box,
  Text,
  Pressable,
  GRADIENT_STYLE,
  GRADIENT_COLORS,
} from '../../theme'
import { AppIcons } from '../../assets'
import { scale } from 'react-native-size-matters'
import LinearGradient from 'react-native-linear-gradient'
import { useHeaderHeight } from '@react-navigation/elements'
import { useRecoilValue } from 'recoil'
import { aboutVisitedState } from '../../atoms'

const { LogoFull, OneWalletAllChains } = AppIcons

type EntryProps = NativeStackScreenProps<RootStackParamList, 'Entry'>

const Entry: FC<EntryProps> = (props): JSX.Element => {
  const { navigation } = props
  const headerHeight = useHeaderHeight()
  const visited = useRecoilValue(aboutVisitedState)

  useEffect(() => {
    if (!visited) {
      navigation.navigate('AboutLiqualityDrawer', {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleImportPress = () =>
    navigation.navigate('TermsScreen', {
      nextScreen: 'UnlockWalletScreen',
      previousScreen: 'Entry',
    })

  const handleCreateWalletPress = () =>
    navigation.navigate('TermsScreen', {
      nextScreen: 'SeedPhraseScreen',
      previousScreen: 'Entry',
    })

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      style={[GRADIENT_STYLE, { paddingTop: headerHeight }]}>
      <LogoFull width={scale(100)} />
      <Box flex={0.9} marginTop="xl">
        <OneWalletAllChains width={scale(175)} />
      </Box>
      <Pressable
        label={{ tx: 'entryScreen.createNewWallet' }}
        onPress={handleCreateWalletPress}
        variant="outline"
      />
      <Box marginTop={'xl'} alignItems="center">
        <Text opacity={0.8} variant={'whiteLabel'} tx="common.forgotPassword" />
        <Text
          opacity={0.8}
          variant={'whiteLabel'}
          tx="common.importWithSeedPhrase"
          marginTop={'s'}
          onPress={handleImportPress}
        />
      </Box>
    </LinearGradient>
  )
}

export default Entry

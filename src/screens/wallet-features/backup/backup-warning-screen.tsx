import React, { useCallback } from 'react'
import { Text, Box, Pressable } from '../../../theme'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { AppIcons } from '../../../assets'
import { scale } from 'react-native-size-matters'

const { PrivateKeyWarn, SeedPhraseWarn } = AppIcons

const lineHeightAdjustment = scale(-20)

const BackupWarningScreen: React.FC<
  NativeStackScreenProps<MainStackParamList, 'BackupWarningScreen'>
> = (props) => {
  const { navigation, route } = props

  const { isPrivateKey = false } = route.params

  const handleBackupBtnPress = useCallback(() => {
    const routeName: keyof MainStackParamList = isPrivateKey
      ? 'BackupPrivateKeyScreen'
      : 'BackupLoginScreen'
    navigation.navigate(routeName, { ...route.params })
  }, [navigation, isPrivateKey, route])

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingHorizontal={'screenPadding'}>
      <Box flex={0.75}>
        {isPrivateKey ? <PrivateKeyWarn /> : <SeedPhraseWarn />}
        <Box
          marginTop={'xxl'}
          backgroundColor={'yellow'}
          padding="s"
          alignSelf="flex-start">
          <Text tx="warning" variant={'warnHighlight'} color={'black2'} />
        </Box>
        <Text
          marginTop={'l'}
          tx={'backupWarningScreen.show'}
          variant={'warnHeader'}
          color={'black2'}
        />
        <Text
          tx={isPrivateKey ? 'privateKey' : 'backupWarningScreen.seedPhrase'}
          variant={'warnHeader'}
          style={{ marginTop: lineHeightAdjustment }}
          color={'black2'}
        />
        <Text
          tx={
            isPrivateKey
              ? 'backupWarningScreen.anyOneWhoPrivate'
              : 'backupWarningScreen.anyoneWhoSeed'
          }
          variant={'warnText'}
          color={'black2'}
        />
      </Box>
      <Box flex={0.25}>
        <Box marginVertical={'xl'}>
          <Pressable
            label={{ tx: 'backupWarningScreen.iHavePrivacy' }}
            onPress={handleBackupBtnPress}
            variant="warn"
          />
        </Box>
        <Text
          onPress={navigation.goBack}
          textAlign={'center'}
          variant="link"
          color={'black'}
          tx="termsScreen.cancel"
        />
      </Box>
    </Box>
  )
}

export default BackupWarningScreen

import React, { useCallback } from 'react'
import { Text, Box, Pressable } from '../../../theme'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { labelTranslateFn } from '../../../utils'
import { AppIcons } from '../../../assets'

const { PrivateKeyWarn, SeedPhraseWarn } = AppIcons

const BackupWarningScreen: React.FC<
  NativeStackScreenProps<MainStackParamList, 'BackupWarningScreen'>
> = (props) => {
  const { navigation, route } = props

  const { isPrivateKey = false } = route.params

  const handleBackupBtnPress = useCallback(() => {
    if (isPrivateKey) {
      return
    }
    navigation.navigate('BackupLoginScreen', {
      backupSeed: true,
      screenTitle: labelTranslateFn('backupWarningScreen.signIn')!,
    })
  }, [navigation, isPrivateKey])

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
          <Text tx="warning" variant={'warnHighlight'} color={'black'} />
        </Box>
        <Text
          marginTop={'l'}
          tx={
            isPrivateKey
              ? 'backupWarningScreen.showPrivateKey'
              : 'backupWarningScreen.showSeedPhrase'
          }
          variant={'warnHeader'}
          color={'black'}
        />
        <Text
          tx={
            isPrivateKey
              ? 'backupWarningScreen.anyOneWhoPrivate'
              : 'backupWarningScreen.anyoneWhoSeed'
          }
          variant={'warnText'}
          color={'black'}
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

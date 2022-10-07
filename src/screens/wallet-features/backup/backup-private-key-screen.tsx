import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, Box, faceliftPalette } from '../../../theme'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { AppIcons } from '../../../assets'
import { scale, ScaledSheet } from 'react-native-size-matters'

const { PrivateKeyIcon, CopyIcon } = AppIcons

const lineHeightAdjustment = scale(-20)

const BackupPrivateKeyScreen: React.FC<
  NativeStackScreenProps<MainStackParamList, 'BackupPrivateKeyScreen'>
> = (props) => {
  const { navigation } = props

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingHorizontal={'screenPadding'}>
      <PrivateKeyIcon />
      <Text
        marginTop={'xl'}
        tx={'your'}
        variant={'warnHeader'}
        color={'black2'}
      />
      <Text
        tx={'privateKey'}
        variant={'warnHeader'}
        color={'black2'}
        style={{ marginTop: lineHeightAdjustment }}
      />
      <Text tx={'neverDiscloseInfo'} variant={'warnText'} color={'black2'} />
      <Text marginTop={'l'} variant="subListText" color={'greyMeta'}>
        [Account Name. Can be long]
      </Text>
      <Text>0x2345...4322</Text>
      <Box
        marginTop={'xxl'}
        justifyContent="space-evenly"
        alignItems={'center'}
        backgroundColor={'mediumWhite'}
        paddingHorizontal={'screenPadding'}
        flex={0.9}>
        <Text textAlign={'center'} color="textColor" variant={'networkStatus'}>
          ALeKk017v9RPuC5sQhNnxBNJIfQ1vIWEUA%3A1629768043179&eiALeKk017v9RPuC5sQhNnxBNJIfQ1vIWEUA%3A1629768043179&ei
        </Text>
        <Box width={'100%'} alignItems="center">
          <TouchableOpacity style={styles.copyBtnStyle} activeOpacity={0.7}>
            <CopyIcon />
            <Text
              marginLeft={'m'}
              marginTop={'s'}
              variant={'normalText'}
              color={'white'}
              tx="copyPrivateKey"
            />
          </TouchableOpacity>
          <Text
            marginTop={'l'}
            onPress={navigation.goBack}
            textAlign={'center'}
            variant="link"
            color={'black'}
            tx="termsScreen.cancel"
          />
        </Box>
      </Box>
    </Box>
  )
}

const styles = ScaledSheet.create({
  copyBtnStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '36@s',
    width: '70%',
    backgroundColor: faceliftPalette.buttonDefault,
  },
})

export default BackupPrivateKeyScreen

import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, Box, faceliftPalette, showCopyToast } from '../../../theme'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { AppIcons } from '../../../assets'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { labelTranslateFn } from '../../../utils'
import { showPrivateKeyAsPerChain } from '../../../store/store'
import Clipboard from '@react-native-clipboard/clipboard'

const { PrivateKeyIcon, CopyIcon } = AppIcons

const lineHeightAdjustment = scale(-20)

const BackupPrivateKeyScreen: React.FC<
  NativeStackScreenProps<MainStackParamList, 'BackupPrivateKeyScreen'>
> = (props) => {
  const { navigation, route } = props
  const [privateKey, setPrivateKey] = useState('')
  useEffect(() => {
    const fetchPrivateKey = async () => {
      try {
        const { network, walletId, accountId, chain } = route.params
        if (network && walletId && accountId && chain) {
          const pk = await showPrivateKeyAsPerChain({
            network,
            walletId,
            accountId,
            chainId: chain,
          })
          if (pk) {
            setPrivateKey(pk)
          }
        }
      } catch (error) {}
    }
    fetchPrivateKey()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showToast = () => {
    showCopyToast('copyToast', labelTranslateFn('privateKeyCopied')!)
    Clipboard.setString(privateKey)
  }

  const buttonStatus = !privateKey.length

  const backgroundColor = !privateKey.length
    ? faceliftPalette.buttonDisabled
    : faceliftPalette.buttonActive

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
        {route.params.accountName}
      </Text>
      <Text>{route.params.shortenAddress}</Text>
      <Box
        marginTop={'xxl'}
        justifyContent="space-evenly"
        alignItems={'center'}
        backgroundColor={'mediumWhite'}
        paddingHorizontal={'screenPadding'}
        flex={0.9}>
        <Text textAlign={'center'} color="textColor" variant={'networkStatus'}>
          {privateKey || labelTranslateFn('notFound')}
        </Text>
        <Box width={'100%'} alignItems="center">
          <TouchableOpacity
            style={[styles.copyBtnStyle, { backgroundColor }]}
            activeOpacity={0.7}
            disabled={buttonStatus}
            onPress={showToast}>
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
  },
})

export default BackupPrivateKeyScreen

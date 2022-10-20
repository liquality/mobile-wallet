import { Linking, TouchableOpacity } from 'react-native'
import React from 'react'
import { Box, Text } from '../theme'
import { AppIcons } from '../assets'
import I18n from 'i18n-js'
import { useNavigation } from '@react-navigation/core'
import { scale } from 'react-native-size-matters'

const { BuyCryptoCloseLight, TransakIcon, TiltedArrow, OnRamperIcon } = AppIcons

type BuyCryptoComponentProps = {
  headerHeight: number
  token: string
  isScrolledUp: boolean
}

const BuyCryptoComponent: React.FC<BuyCryptoComponentProps> = ({
  headerHeight,
  token,
  isScrolledUp,
}) => {
  const navigation = useNavigation()

  const handleLinkPress = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url)
      }
    })
  }

  return (
    <>
      {!isScrolledUp ? (
        <Box marginTop={'xl'} alignItems="flex-end" padding={'screenPadding'}>
          <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
            <BuyCryptoCloseLight />
          </TouchableOpacity>
        </Box>
      ) : null}
      <Box
        flex={1}
        backgroundColor="mainBackground"
        style={{ paddingTop: isScrolledUp ? scale(10) : headerHeight / 2 }}
        paddingHorizontal={'screenPadding'}>
        {!isScrolledUp ? (
          <Text
            marginTop={'s'}
            variant={'buyCryptoHeader'}
            color="darkGrey"
            tx="buyCrypto"
          />
        ) : null}
        <Box marginTop={'xl'}>
          <TransakIcon />
        </Box>
        <Text marginTop={'m'} tx="transakContent" variant={'h7'} />
        <Box marginTop={'m'} flexDirection="row">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleLinkPress('https://transak.com/')}>
            <Text color={'link'} variant="h6">
              {I18n.t('buyTknWithTransak', { token })}
            </Text>
          </TouchableOpacity>
          <Box marginLeft={'s'}>
            <TiltedArrow />
          </Box>
        </Box>
        <Box marginTop={'xl'} height={1} backgroundColor="inactiveText" />
        <Box marginTop={'xl'}>
          <OnRamperIcon />
        </Box>
        <Text marginTop={'m'} tx="onRamperContent" variant={'h7'} />
        <Box marginTop={'m'} flexDirection="row">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleLinkPress('https://onramper.com/')}>
            <Text color={'link'} variant="h6">
              {I18n.t('buyTknWithOnramper', { token })}
            </Text>
          </TouchableOpacity>
          <Box marginLeft={'s'}>
            <TiltedArrow />
          </Box>
        </Box>
        <Box marginTop={'xl'} height={1} backgroundColor="inactiveText" />
        <Box marginTop={'xl'}>
          <Text
            marginTop={'m'}
            tx="feeAndLimit"
            variant={'h10'}
            color="greyMeta"
          />
        </Box>
      </Box>
    </>
  )
}

export default BuyCryptoComponent

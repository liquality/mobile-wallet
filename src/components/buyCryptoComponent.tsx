import { ImageBackground, Linking, TouchableOpacity } from 'react-native'
import React from 'react'
import { Box, IMAGE_BACKGROUND_STYLE, Text } from '../theme'
import { AppIcons, Images } from '../assets'
import I18n from 'i18n-js'
import { useNavigation, NavigationProp } from '@react-navigation/core'
import { scale } from 'react-native-size-matters'
import { MainStackParamList } from '../types'
import { labelTranslateFn, SCREEN_WIDTH } from '../utils'
import { ActionEnum } from '../types'

const {
  BuyCryptoCloseLight,
  TransakIcon,
  TiltedArrow,
  OnRamperIcon,
  DownIcon,
} = AppIcons

const IntroComponent = ({
  onPress,
  isScrolledUp = false,
}: {
  onPress: () => void
  isScrolledUp: boolean
}) => {
  return (
    <>
      {!isScrolledUp ? (
        <Text
          marginTop={'s'}
          variant={'gettingStartHeader'}
          color="darkGrey"
          tx="gettingStartedWithCrypto"
        />
      ) : null}
      <Text marginVertical={'l'} tx="weRecommedToStart" variant={'h7'} />

      <Box width={SCREEN_WIDTH / 4.3} marginTop="s">
        <TouchableOpacity onPress={onPress}>
          <ImageBackground
            style={IMAGE_BACKGROUND_STYLE}
            resizeMode="cover"
            source={Images.hexoNav}>
            <Box flex={1} justifyContent="center" alignItems={'center'}>
              <DownIcon height={scale(14)} />
            </Box>
          </ImageBackground>
        </TouchableOpacity>
        <Text
          marginTop={'s'}
          textAlign="center"
          variant="addressLabel"
          color={'darkGrey'}
          tx="summaryBlockComp.receive"
        />
      </Box>
      <Box marginVertical={'xl'} height={1} backgroundColor="inactiveText" />
    </>
  )
}

type BuyCryptoComponentProps = {
  headerHeight: number
  token: string
  isScrolledUp: boolean
  showIntro: boolean
}

const BuyCryptoComponent: React.FC<BuyCryptoComponentProps> = ({
  headerHeight,
  token,
  isScrolledUp,
  showIntro,
}) => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()

  const handleLinkPress = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url)
      }
    })
  }

  const handleReceiveBtnPress = React.useCallback(() => {
    navigation.navigate('AssetChooserScreen', {
      screenTitle: labelTranslateFn('summaryBlockComp.selectAssetReceive')!,
      action: ActionEnum.RECEIVE,
    })
  }, [navigation])

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
        {showIntro ? (
          <IntroComponent
            isScrolledUp={isScrolledUp}
            onPress={handleReceiveBtnPress}
          />
        ) : null}
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

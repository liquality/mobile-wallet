import {
  Modal,
  ViewStyle,
  ImageBackground,
  TouchableWithoutFeedback,
  useColorScheme,
} from 'react-native'
import React, { useCallback, useState } from 'react'
import { Box, Pressable, ThemeIcon, ThemeText } from '../../theme'
import { useNavigation } from '@react-navigation/core'
import { useRecoilState, useRecoilValue } from 'recoil'
import { optInAnalyticsState, themeMode } from '../../atoms'
import { Fonts, Images, AppIcons } from '../../assets'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { ONBOARDING_SCREEN_DEFAULT_PADDING } from '../../utils'
import { CommonActions } from '@react-navigation/native'

const { ModalClose } = AppIcons

type AnalyticsModalProps = {
  onAction: (params: boolean) => void
  nextScreen: string
}

enum SelectedOption {
  Sure = 'sure',
  Not = 'not',
}

type IconName = 'InactiveRadioButton' | 'ActiveRadioButton'

const defaultPadding: ViewStyle = {
  padding: ONBOARDING_SCREEN_DEFAULT_PADDING,
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  onAction,
  nextScreen,
}) => {
  const navigation = useNavigation()
  const [analytics, setAnalytics] = useRecoilState(optInAnalyticsState)
  const [selectedOpt, setSelectedOpt] = useState(SelectedOption.Sure)

  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  const handleOkButtonPress = useCallback(() => {
    onAction(false)
    setAnalytics({
      ...(analytics || {}),
      acceptedDate: selectedOpt === 'sure' ? Date.now() : undefined,
    })

    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Entry' },
          {
            name: nextScreen,
            params: {
              termsAcceptedAt: Date.now(),
            },
          },
        ],
      }),
    )
  }, [onAction, setAnalytics, analytics, navigation, nextScreen, selectedOpt])

  const sureIcon: IconName =
    selectedOpt === 'sure' ? 'ActiveRadioButton' : 'InactiveRadioButton'

  const notIcon: IconName =
    selectedOpt === 'not' ? 'ActiveRadioButton' : 'InactiveRadioButton'

  const backgroundColor =
    currentTheme === 'dark' ? 'semiTransparentDark' : 'semiTransparentWhite'

  const lowerBgImg =
    currentTheme === 'light' ? Images.rectangleDark : Images.rectangleLight

  const uppperBgImg =
    currentTheme === 'dark' ? Images.rectangleDark : Images.rectangleLight

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      style={styles.modalView}>
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor={backgroundColor}
        paddingHorizontal="onboardingPadding">
        <Box width="100%" height={scale(450)}>
          <ImageBackground
            style={styles.lowerBgImg}
            resizeMode="contain"
            source={lowerBgImg}>
            <ImageBackground
              style={styles.upperBgImg}
              resizeMode="contain"
              source={uppperBgImg}>
              <Box flex={1} style={defaultPadding}>
                <ThemeText
                  style={styles.helpUsTextStyle}
                  tx="optInAnalyticsModal.helpUsToImprove"
                />
                <ThemeText
                  marginTop={'m'}
                  style={styles.weWantToBetterTextStyle}
                  tx="optInAnalyticsModal.shareWhereYouClick"
                />
                <TouchableWithoutFeedback
                  onPress={() => setSelectedOpt(SelectedOption.Sure)}>
                  <Box marginTop={'m'} flexDirection="row">
                    <ThemeIcon iconName={sureIcon} />
                    <ThemeText
                      marginLeft={'m'}
                      tx="optInAnalyticsModal.shareMyClicks"
                    />
                  </Box>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => setSelectedOpt(SelectedOption.Not)}>
                  <Box marginTop={'m'} flexDirection="row">
                    <ThemeIcon iconName={notIcon} />
                    <ThemeText
                      marginLeft={'m'}
                      tx="optInAnalyticsModal.notToday"
                    />
                  </Box>
                </TouchableWithoutFeedback>

                <Box marginTop={'xl'}>
                  <Pressable
                    label={{ tx: 'Ok' }}
                    onPress={handleOkButtonPress}
                    variant="solid"
                    style={styles.okButton}
                  />
                </Box>
              </Box>
            </ImageBackground>
          </ImageBackground>
          <TouchableWithoutFeedback onPress={() => onAction(false)}>
            <Box position={'absolute'} right={scale(-5)} top={scale(-10)}>
              <ModalClose />
            </Box>
          </TouchableWithoutFeedback>
        </Box>
      </Box>
    </Modal>
  )
}

const styles = ScaledSheet.create({
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lowerBgImg: {
    height: '99%',
  },
  upperBgImg: {
    height: '100%',
    marginTop: scale(-10),
    marginLeft: scale(-15),
  },
  helpUsTextStyle: {
    fontFamily: Fonts.JetBrainsMono,
    fontWeight: '500',
    fontSize: scale(30),
    lineHeight: scale(38),
    textAlign: 'left',
  },
  weWantToBetterTextStyle: {
    fontFamily: Fonts.Regular,
    fontWeight: '400',
    fontSize: scale(17),
    lineHeight: scale(22),
  },
  okButton: {
    height: scale(40),
  },
})

export default AnalyticsModal

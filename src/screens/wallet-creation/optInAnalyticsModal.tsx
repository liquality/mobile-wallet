import {
  Modal,
  ViewStyle,
  TouchableWithoutFeedback,
  useColorScheme,
} from 'react-native'
import React, { useCallback, useState } from 'react'
import { Box, Pressable, ThemeIcon, Text } from '../../theme'
import { useNavigation } from '@react-navigation/core'
import { useRecoilState, useRecoilValue } from 'recoil'
import { optInAnalyticsState, themeMode } from '../../atoms'
import { Fonts, AppIcons } from '../../assets'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { SCREEN_PADDING } from '../../utils'
import { CommonActions } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const { ModalClose, RectangleDark, RectangleLight } = AppIcons

type AnalyticsModalProps = {
  onAction: (params: boolean) => void
  nextScreen: string
  previousScreen: string
}

enum SelectedOption {
  Sure = 'sure',
  Not = 'not',
}

type IconName = 'InactiveRadioButton' | 'ActiveRadioButton'

const defaultPadding: ViewStyle = {
  padding: scale(SCREEN_PADDING),
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  onAction,
  nextScreen,
  previousScreen,
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
          { name: previousScreen },
          {
            name: nextScreen,
            params: {
              termsAcceptedAt: Date.now(),
            },
          },
        ],
      }),
    )
  }, [
    onAction,
    setAnalytics,
    analytics,
    navigation,
    nextScreen,
    previousScreen,
    selectedOpt,
  ])

  const sureIcon: IconName =
    selectedOpt === 'sure' ? 'ActiveRadioButton' : 'InactiveRadioButton'

  const notIcon: IconName =
    selectedOpt === 'not' ? 'ActiveRadioButton' : 'InactiveRadioButton'

  const backgroundColor =
    currentTheme === 'dark' ? 'semiTransparentDark' : 'semiTransparentWhite'

  const LowerBgSvg = currentTheme === 'light' ? RectangleDark : RectangleLight

  const UppperBgSvg = currentTheme === 'dark' ? RectangleDark : RectangleLight

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
        <Box width="100%" height={scale(400)}>
          <Box flex={1} style={defaultPadding}>
            <Text
              color={'textColor'}
              paddingTop="m"
              style={styles.helpUsTextStyle}
              tx="optInAnalyticsModal.helpUsToImprove"
            />
            <Text
              color={'textColor'}
              marginTop={'l'}
              variant={'normalText'}
              tx="optInAnalyticsModal.shareWhereYouClick"
            />
            <Box marginTop={'s'}>
              <TouchableWithoutFeedback
                onPress={() => setSelectedOpt(SelectedOption.Sure)}>
                <Box marginTop={'m'} flexDirection="row" alignItems={'center'}>
                  <ThemeIcon
                    iconName={sureIcon}
                    height={scale(20)}
                    width={scale(20)}
                  />
                  <Text
                    variant={'radioText'}
                    color={'textColor'}
                    marginLeft={'m'}
                    tx="optInAnalyticsModal.shareMyClicks"
                  />
                </Box>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => setSelectedOpt(SelectedOption.Not)}>
                <Box marginTop={'m'} flexDirection="row" alignItems={'center'}>
                  <ThemeIcon
                    iconName={notIcon}
                    height={scale(20)}
                    width={scale(20)}
                  />
                  <Text
                    color={'textColor'}
                    variant={'radioText'}
                    marginLeft={'m'}
                    tx="optInAnalyticsModal.notToday"
                  />
                </Box>
              </TouchableWithoutFeedback>
            </Box>
            <Box marginTop={'l'}>
              <Pressable
                label={{ tx: 'Ok' }}
                onPress={handleOkButtonPress}
                variant="solid"
                style={styles.okButton}
              />
            </Box>
            <Box position={'absolute'} top={5} zIndex={-1}>
              <UppperBgSvg />
            </Box>
            <Box
              position={'absolute'}
              zIndex={-2}
              left={scale(10)}
              top={scale(27)}>
              <LowerBgSvg />
            </Box>
            <Box position={'absolute'} zIndex={100} right={scale(-8)}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onAction(false)}>
                <ModalClose />
              </TouchableOpacity>
            </Box>
          </Box>
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
    height: '100%',
    marginLeft: scale(10),
  },
  upperBgImg: {
    height: '100%',
    marginTop: scale(-8),
    marginLeft: scale(-8),
  },
  helpUsTextStyle: {
    fontFamily: Fonts.Regular,
    fontWeight: '500',
    fontSize: scale(24),
    lineHeight: scale(30),
    textAlign: 'left',
  },
  okButton: {
    height: scale(36),
    width: scale(54),
  },
})

export default AnalyticsModal

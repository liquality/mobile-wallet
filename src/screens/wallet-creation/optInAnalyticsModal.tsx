import {
  Modal,
  TouchableWithoutFeedback,
  useColorScheme,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native'
import React, { useCallback, useState } from 'react'
import { Box, Pressable, ThemeIcon, Text, faceliftPalette } from '../../theme'
import { useNavigation } from '@react-navigation/core'
import { useRecoilState, useRecoilValue } from 'recoil'
import { optInAnalyticsState, themeMode } from '../../atoms'
import { Fonts, AppIcons } from '../../assets'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { CommonActions } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Path, Svg } from 'react-native-svg'

const { ModalClose } = AppIcons

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

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  onAction,
  nextScreen,
  previousScreen,
}) => {
  const navigation = useNavigation()
  const [analytics, setAnalytics] = useRecoilState(optInAnalyticsState)
  const [selectedOpt, setSelectedOpt] = useState(SelectedOption.Sure)
  const [viewHeight, setViewHeight] = useState<number>(0)
  const [viewWidth, setViewWidth] = useState<number>(0)

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

  const onLayout = (event: LayoutChangeEvent) => {
    setViewHeight(event.nativeEvent.layout.height)
    setViewWidth(event.nativeEvent.layout.width)
  }

  const getBackgroundBox = (width: number, height: number) => {
    const flatRadius = 60
    return (
      <Box
        alignItems="center"
        justifyContent="center"
        shadowColor={'darkGrey'}
        shadowOffset={{ width: 4, height: 6 }}
        shadowOpacity={1}
        shadowRadius={0}
        elevation={2}
        style={StyleSheet.absoluteFillObject}>
        <Svg
          width={`${width}`}
          height={`${height}`}
          viewBox={`0 0 ${width} ${height}`}
          fill="none">
          <Path
            d={`M0 0 H ${
              width - flatRadius
            } L ${width} ${flatRadius} V ${height} H ${0} V ${0} Z`}
            fill={faceliftPalette.white}
            strokeWidth={4}
            stroke={faceliftPalette.darkGrey}
            strokeLinejoin={'round'}
            strokeLinecap={'round'}
          />
        </Svg>
      </Box>
    )
  }

  const sureIcon: IconName =
    selectedOpt === 'sure' ? 'ActiveRadioButton' : 'InactiveRadioButton'

  const notIcon: IconName =
    selectedOpt === 'not' ? 'ActiveRadioButton' : 'InactiveRadioButton'

  const backgroundColor =
    currentTheme === 'dark' ? 'semiTransparentDark' : 'semiTransparentWhite'

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor={backgroundColor}
        paddingHorizontal="onboardingPadding">
        <Box
          paddingVertical={'mxxl'}
          paddingHorizontal={'onboardingPadding'}
          onLayout={onLayout}>
          {getBackgroundBox(viewWidth, viewHeight)}
          <Text
            color={'textColor'}
            paddingTop="m"
            fontFamily={Fonts.Regular}
            fontSize={scale(27)}
            lineHeight={scale(30)}
            letterSpacing={0.5}
            textAlign={'left'}
            tx="optInAnalyticsModal.helpUsToImprove"
          />
          <Text
            color={'textColor'}
            marginTop={'l'}
            fontSize={17}
            letterSpacing={0.5}
            lineHeight={21}
            tx="optInAnalyticsModal.shareWhereYouClick"
          />
          <Box marginVertical={'l'}>
            <TouchableWithoutFeedback
              onPress={() => setSelectedOpt(SelectedOption.Sure)}>
              <Box
                marginTop={'m'}
                flexDirection="row"
                alignItems={'center'}
                height={scale(1.3 * 16)}>
                <ThemeIcon
                  iconName={sureIcon}
                  height={scale(1.3 * 16)}
                  width={scale(1.3 * 16)}
                />
                <Text
                  color={'textColor'}
                  fontSize={scale(16)}
                  lineHeight={scale(1.2 * 16)}
                  style={{ height: scale(1.3 * 16) }}
                  marginLeft={'m'}
                  tx="optInAnalyticsModal.shareMyClicks"
                />
              </Box>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => setSelectedOpt(SelectedOption.Not)}>
              <Box
                marginTop={'m'}
                flexDirection="row"
                alignItems={'center'}
                height={scale(1.3 * 16)}>
                <ThemeIcon
                  iconName={notIcon}
                  height={scale(1.3 * 16)}
                  width={scale(1.3 * 16)}
                />
                <Text
                  color={'textColor'}
                  fontSize={scale(16)}
                  lineHeight={scale(1.2 * 16)}
                  style={{ height: scale(1.3 * 16) }}
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
          <Box position={'absolute'} zIndex={100} right={scale(-8)}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onAction(false)}>
              <ModalClose />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

const styles = ScaledSheet.create({
  okButton: {
    height: scale(36),
    width: scale(54),
  },
})

export default AnalyticsModal

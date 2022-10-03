import { createTheme } from '@shopify/restyle'
import { Fonts } from '../assets'
import { faceliftPalette } from './faceliftPalette'
import { palette } from './palette'
import { scale } from 'react-native-size-matters'

export const theme = createTheme({
  colors: {
    mainBackground: faceliftPalette.lightBackground,
    textColor: faceliftPalette.lightText,
    mainForeground: faceliftPalette.white,
    secondaryForeground: palette.black,
    tertiaryForeground: palette.darkGray,
    buttonFontPrimary: palette.white,
    buttonFontSecondary: palette.blueVioletPrimary,
    buttonFontTertiary: palette.black,
    buttonBackgroundPrimary: palette.blueVioletPrimary,
    buttonBackgroundSecondary: palette.white,
    mainButtonBorderColor: palette.blueVioletPrimary,
    secondaryButtonBorderColor: palette.gray,
    danger: faceliftPalette.red,
    spinner: faceliftPalette.white,
    cardPrimaryBackground: palette.purplePrimary,
    buttonPrimaryBackground: palette.purplePrimary,
    mainBorderColor: palette.gray,
    link: faceliftPalette.buttonDefault,
    transparentBlack: palette.transparentBlack,
    progressDotColor: palette.turquoise,
    addressColor: palette.black2,
    errorMsgBarColor: palette.yellowBar,
    transparent: 'transparent',
    white: faceliftPalette.white,
    darkGrey: faceliftPalette.darkGrey,
    activeButton: faceliftPalette.buttonActive,
    semiTransparentWhite: faceliftPalette.semiTransparentWhite,
    semiTransparentDark: faceliftPalette.semiTransparentDark,
    liqPink: faceliftPalette.buttonActive,
    onboardInputColor: faceliftPalette.lightWhite,
    onboardInputBorder: faceliftPalette.white,
  },
  spacing: {
    vs: scale(2),
    s: scale(5),
    m: scale(10),
    l: scale(15),
    xl: scale(20),
    xxl: scale(50),
    xxxl: scale(70),
    onboardingPadding: scale(40),
    onboardingHeaderPadding: scale(25),
  },
  breakpoints: {
    phone: 0,
    longPhone: {
      width: 0,
      height: 812,
    },
    tablet: 768,
    largeTablet: 1024,
  },
  textVariants: {
    header: {
      fontFamily: Fonts.Regular,
      fontSize: 12,
      fontWeight: '700',
      lineHeight: 18,
      marginVertical: 's',
      marginRight: 's',
      color: 'secondaryForeground',
    },
    pinkText: {
      fontFamily: Fonts.Regular,
      color: palette.gray,
      fontWeight: '600',
      fontSize: 20,
    },
    tabHeader: {
      fontFamily: Fonts.Regular,
      fontSize: 13,
      fontWeight: '600',
      color: 'secondaryForeground',
    },
    content: {
      fontFamily: Fonts.Regular,
      fontWeight: '300',
      fontSize: 12,
      color: 'tertiaryForeground',
    },
    label: {
      fontFamily: Fonts.Regular,
      fontSize: 13,
      fontWeight: '600',
      color: 'secondaryForeground',
      marginBottom: 's',
    },
    slogan1: {
      fontFamily: Fonts.Light,
      color: 'mainForeground',
      fontSize: 24,
    },
    slogan2: {
      fontFamily: Fonts.Thin,
      color: 'mainForeground',
      fontSize: 55,
      marginVertical: 'l',
    },
    description: {
      fontFamily: Fonts.Regular,
      fontWeight: '600',
      fontSize: 14,
      lineHeight: 24,
      color: 'mainForeground',
    },
    mainInputLabel: {
      fontFamily: Fonts.Regular,
      fontWeight: '500',
      fontSize: scale(15),
      lineHeight: scale(21),
      color: 'mainForeground',
    },
    secondaryInputLabel: {
      fontFamily: Fonts.Regular,
      fontWeight: '700',
      fontSize: 12,
      lineHeight: 18,
      color: 'secondaryForeground',
      marginBottom: 's',
    },
    body: {
      fontFamily: Fonts.Regular,
      fontWeight: '600',
      fontSize: 14,
      lineHeight: 24,
      color: 'secondaryForeground',
    },
    mainButtonLabel: {
      fontFamily: Fonts.Regular,
      fontWeight: '600',
      fontSize: 14,
      color: 'buttonFontPrimary',
    },
    tertiaryButtonLabel: {
      fontFamily: Fonts.Regular,
      fontWeight: '400',
      fontSize: 12,
      color: 'buttonFontTertiary',
    },
    amount: {
      fontFamily: Fonts.Regular,
      fontWeight: '400',
      fontSize: 12,
      color: 'secondaryForeground',
    },
    amountLarge: {
      fontFamily: Fonts.Regular,
      fontWeight: '300',
      fontSize: 28,
    },
    amountLabel: {
      fontFamily: Fonts.Light,
      fontWeight: '400',
      fontSize: 14,
      color: 'tertiaryForeground',
    },
    warningBold: {
      fontFamily: Fonts.Regular,
      fontWeight: '500',
      fontSize: 10,
      lineHeight: 16,
    },
    warningLight: {
      fontFamily: Fonts.Light,
      fontWeight: '300',
      fontSize: 10,
      lineHeight: 16,
      paddingLeft: 's',
    },
    link: {
      fontFamily: Fonts.Regular,
      fontWeight: '500',
      fontSize: scale(14),
      color: 'link',
    },
    boldLink: {
      fontFamily: Fonts.Regular,
      fontWeight: '600',
      fontSize: 12,
      lineHeight: 16,
      color: 'link',
    },
    timelineLabel: {
      fontFamily: Fonts.Regular,
      fontWeight: '300',
      fontSize: 12,
      lineHeight: 18,
      marginRight: 's',
    },
    address: {
      fontFamily: Fonts.Regular,
      fontWeight: '300',
      fontSize: 12,
      lineHeight: 18,
      color: 'addressColor',
    },
    error: {
      fontFamily: Fonts.Light,
      color: 'danger',
      fontWeight: '500',
      fontSize: 12,
      marginTop: 's',
      paddingLeft: 's',
      paddingVertical: 's',
      marginHorizontal: 'xl',
      height: 25,
    },
    errorLight: {
      fontFamily: Fonts.Regular,
      fontWeight: 'bold',
      fontSize: 12,
      marginTop: 's',
      paddingLeft: 's',
      paddingVertical: 's',
      marginHorizontal: 'xl',
      height: 25,
      color: 'mainForeground',
    },
    loginToSeePhraseTitle: {
      fontFamily: Fonts.Thin,
      color: 'mainForeground',
      fontSize: 35,
      textAlign: 'center',
      marginVertical: 'l',
    },
    loading: {
      fontFamily: Fonts.Regular,
      fontWeight: '400',
      fontSize: 28,
      color: 'mainForeground',
      textAlign: 'center',
      marginHorizontal: 'xl',
      marginTop: 'l',
      lineHeight: 28,
    },
    settingLabel: {
      fontFamily: Fonts.Regular,
      fontWeight: '500',
      fontSize: 16,
      color: 'addressColor',
      marginRight: 's',
    },
    pressableLabel: {
      fontFamily: Fonts.Regular,
      fontWeight: '500',
      fontSize: scale(14),
      color: 'white',
    },
    whiteLabel: {
      fontFamily: Fonts.Regular,
      fontWeight: '500',
      fontSize: scale(15),
      color: 'white',
    },
    hintLabel: {
      fontFamily: Fonts.Regular,
      fontSize: scale(14),
      color: 'white',
      fontWeight: '400',
    },
    numberLabel: {
      fontFamily: Fonts.Regular,
      fontSize: scale(14),
      color: 'white',
      fontWeight: '600',
    },
    normalText: {
      fontFamily: Fonts.Regular,
      fontSize: scale(17),
      fontWeight: '400',
      lineHeight: scale(22),
    },
    termsBody: {
      fontFamily: Fonts.Regular,
      fontSize: scale(17),
      fontWeight: '400',
    },
    h1: {
      fontFamily: Fonts.Regular,
      fontSize: scale(41),
      fontWeight: '500',
      lineHeight: scale(55),
    },
    radioText: {
      fontFamily: Fonts.Regular,
      fontSize: scale(16),
      fontWeight: '400',
    },
  },
  pressableVariants: {
    outline: {
      height: scale(50),
      width: '100%',
      borderWidth: scale(1),
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'white',
    },
    solid: {
      height: scale(50),
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'activeButton',
    },
  },
  buttonVariants: {
    l: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      borderColor: 'mainButtonBorderColor',
      paddingHorizontal: 'l',
      marginVertical: 'l',
      width: '100%',
      height: 36,
    },
    m: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      borderColor: 'mainButtonBorderColor',
      paddingHorizontal: 'l',
      marginVertical: 'l',
      width: 150,
      height: 35,
    },
    s: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      borderColor: 'secondaryButtonBorderColor',
      paddingHorizontal: 'm',
      height: 20,
    },
  },
  roundButtonVariants: {
    smallPrimary: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 45,
      height: 45,
      marginHorizontal: 's',
      borderRadius: 50,
      borderWidth: 1,
      borderColor: 'mainBackground',
    },
    largePrimary: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 60,
      height: 60,
      marginHorizontal: 's',
      borderRadius: 50,
      borderWidth: 1,
      borderColor: 'mainBackground',
      backgroundColor: 'mainBackground',
    },
    secondary: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 45,
      height: 45,
      marginHorizontal: 's',
      borderRadius: 50,
      borderWidth: 1,
      borderColor: 'mainBackground',
      backgroundColor: 'buttonBackgroundPrimary',
    },
    defaults: {
      marginBottom: 'm',
    },
  },
  cardVariants: {
    popUpCard: {
      alignItems: 'center',
      borderRadius: 5,
      borderLeftWidth: 6,
      backgroundColor: 'mainBackground',
      shadowOffset: {
        width: 2,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 3,
    },
    rightArrowCard: {
      width: 15,
      height: 15,
      backgroundColor: 'mainBackground',
      borderRadius: 3,
      shadowOffset: {
        width: 2,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1,
    },
    swapPopup: {
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: 'mainBackground',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
    swapPopUpForToAsset: {
      alignItems: 'center',
      borderRadius: 5,
      borderLeftWidth: 6,
      backgroundColor: 'mainBackground',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
  },
  dropDownVariants: {
    language: {
      width: '50%',
      borderBottomColor: 'progressDotColor',
      borderBottomWidth: 1,
    },
  },
  textInputVariants: {
    passwordInputs: {
      paddingTop: 'm',
      paddingBottom: 's',
      color: 'onboardInputColor',
      borderBottomColor: 'onboardInputBorder',
      borderBottomWidth: 1,
      fontWeight: '500',
      fontSize: scale(15),
    },
    seedPhraseInputs: {
      paddingTop: 's',
      paddingBottom: 's',
      color: 'textColor',
      borderBottomColor: 'activeButton',
      borderBottomWidth: 1,
      fontWeight: '500',
      fontSize: scale(15),
    },
  },
  tabBarStyleVariants: {
    light: {
      backgroundColor: 'mainBackground',
    },
    dark: {
      backgroundColor: 'secondaryForeground',
    },
  },
  indicatorStyle: {
    light: {
      backgroundColor: palette.black,
      height: 1,
    },
    dark: {
      backgroundColor: palette.white,
      height: 1,
    },
  },
  labelStyle: {
    light: {
      color: palette.black2,
      fontFamily: Fonts.Regular,
      fontSize: 13,
      lineHeight: 18,
    },
    dark: {
      color: palette.white,
      fontFamily: Fonts.Regular,
      fontSize: 13,
      lineHeight: 18,
    },
  },
  refreshIndicatorVariants: {
    refreshContainer: {
      alignItems: 'center',
      backgroundColor: 'mainForeground',
      height: 100,
      width: '100%',
    },
  },
})

export type ThemeType = typeof theme

export const darkTheme: ThemeType = {
  ...theme,
  colors: {
    ...theme.colors,
    mainBackground: faceliftPalette.darkBackground,
    textColor: faceliftPalette.darkText,
    spinner: faceliftPalette.darkGrey,
  },
}

export const GRADIENT_COLORS = [
  faceliftPalette.gradientEndColor,
  faceliftPalette.gradientMiddeColor,
  faceliftPalette.gradientMiddeColor,
  faceliftPalette.gradientStartColor,
]

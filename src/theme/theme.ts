import { createTheme } from '@shopify/restyle'
import { Fonts } from '../assets'
import { faceliftPalette } from './faceliftPalette'
import { palette } from './palette'
import { scale } from 'react-native-size-matters'
import { ONBOARDING_PADDING, SCREEN_PADDING } from './../utils/constants'

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
    black: faceliftPalette.black,
    mediumWhite: faceliftPalette.mediumWhite,
    darkGrey: faceliftPalette.darkGrey,
    activeButton: faceliftPalette.buttonActive,
    inactiveButton: faceliftPalette.buttonInactive,
    defaultButton: faceliftPalette.buttonDefault,
    inactiveText: faceliftPalette.grey,
    semiTransparentWhite: faceliftPalette.semiTransparentWhite,
    semiTransparentDark: faceliftPalette.semiTransparentDark,
    liqPink: faceliftPalette.buttonActive,
    onboardInputColor: faceliftPalette.lightWhite,
    onboardInputBorder: faceliftPalette.white,
    popMenuColor: faceliftPalette.semiTransparentWhite,
    nestedColor: palette.nestedColor,
    tablabelActiveColor: palette.buttonActive,
    tablabelInactiveColor: palette.darkGray,
    greyMeta: faceliftPalette.greyMeta,
    headerColor: faceliftPalette.black,
    mediumGrey: faceliftPalette.mediumGrey,
    greyBlack: faceliftPalette.greyBlack,
    yellow: faceliftPalette.yellow,
    darkPink: palette.darkPink,
  },
  spacing: {
    vs: scale(2),
    s: scale(3),
    m: scale(10),
    l: scale(15),
    xl: scale(20),
    xxl: scale(50),
    xxxl: scale(70),
    onboardingPadding: scale(ONBOARDING_PADDING),
    onboardingHeaderPadding: scale(25),
    screenPadding: scale(SCREEN_PADDING),
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
      color: 'darkPink',
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
      fontSize: scale(13),
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
      fontSize: scale(14),
      lineHeight: scale(18),
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
      fontSize: scale(13),
      color: 'white',
    },
    hintLabel: {
      fontFamily: Fonts.Regular,
      fontSize: scale(12),
      color: 'white',
      fontWeight: '400',
    },
    numberLabel: {
      fontFamily: Fonts.Regular,
      fontSize: scale(12),
      color: 'white',
      fontWeight: '600',
    },
    normalText: {
      fontFamily: Fonts.Regular,
      fontSize: scale(15),
      fontWeight: '400',
      lineHeight: scale(20),
    },
    activityText: {
      fontFamily: Fonts.Regular,
      fontSize: scale(14),
      fontWeight: '400',
      lineHeight: scale(18),
    },
    termsBody: {
      fontFamily: Fonts.Regular,
      fontSize: scale(15),
      fontWeight: '400',
    },
    h1: {
      fontFamily: Fonts.Regular,
      fontSize: scale(41),
      fontWeight: '500',
      lineHeight: scale(55),
    },
    h3: {
      fontFamily: Fonts.Regular,
      fontSize: scale(22),
      fontWeight: '500',
    },
    radioText: {
      fontFamily: Fonts.Regular,
      fontSize: scale(14),
      fontWeight: '400',
    },
    listText: {
      fontFamily: Fonts.Regular,
      fontSize: scale(14),
      fontWeight: '500',
    },
    subListText: {
      fontFamily: Fonts.Regular,
      fontSize: scale(13),
      fontWeight: '400',
      lineHeight: scale(17),
    },
    networkStatus: {
      fontFamily: Fonts.JetBrainsMono,
      fontSize: scale(11),
      fontWeight: '400',
    },
    totalBalance: {
      fontFamily: Fonts.Regular,
      fontSize: scale(37),
      fontWeight: '600',
    },
    totalAsset: {
      fontFamily: Fonts.Regular,
      fontSize: scale(36),
      fontWeight: '600',
    },
    tabLabel: {
      fontFamily: Fonts.Regular,
      fontSize: scale(15),
      fontWeight: '500',
    },
    outline: {
      color: 'white',
    },
    solid: {
      color: 'white',
    },
    warn: {
      color: 'black',
    },
    defaultOutline: {
      color: 'defaultButton',
    },
    solidDisabled: {
      color: 'inactiveText',
    },
    largerHeaderTitle: {
      fontFamily: Fonts.Regular,
      fontWeight: '600',
      fontSize: scale(36),
    },
    errorText: {
      fontFamily: Fonts.Regular,
      fontSize: scale(13),
      fontWeight: '400',
    },
    warnHighlight: {
      fontFamily: Fonts.JetBrainsMono,
      fontSize: scale(14),
      fontWeight: '600',
    },
    warnText: {
      fontFamily: Fonts.Regular,
      fontSize: scale(20),
      fontWeight: '400',
      lineHeight: scale(25),
    },
    warnHeader: {
      fontFamily: Fonts.Regular,
      fontSize: scale(45),
      lineHeight: scale(60),
      fontWeight: '400',
    },
  },
  pressableVariants: {
    outline: {
      borderColor: 'white',
      borderWidth: scale(1),
    },
    solid: {
      backgroundColor: 'defaultButton',
    },
    defaultOutline: {
      borderColor: 'defaultButton',
      borderWidth: scale(1),
    },
    solidDisabled: {
      backgroundColor: 'inactiveButton',
    },
    warn: {
      backgroundColor: 'yellow',
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
    headerCard: {
      backgroundColor: 'mainBackground',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 3,
    },
  },
  dropDownVariants: {
    language: {
      width: '100%',
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
      fontFamily: Fonts.Regular,
    },
    seedPhraseInputs: {
      paddingTop: 's',
      color: 'textColor',
      borderBottomColor: 'activeButton',
      borderBottomWidth: 1,
      fontWeight: '400',
      fontSize: scale(16),
      fontFamily: Fonts.Regular,
    },
    searchBoxInput: {
      paddingTop: 's',
      color: 'greyMeta',
      fontWeight: '400',
      fontSize: scale(16),
      fontFamily: Fonts.Regular,
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
      backgroundColor: palette.buttonActive,
      height: scale(2),
      width: scale(20),
    },
    dark: {
      backgroundColor: palette.white,
      height: scale(2),
      width: scale(50),
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
    popMenuColor: faceliftPalette.semiTransparentDark,
    headerColor: faceliftPalette.white,
  },
}

export const GRADIENT_COLORS = [
  faceliftPalette.gradientEndColor,
  faceliftPalette.gradientMiddeColor,
  faceliftPalette.gradientMiddeColor,
  faceliftPalette.gradientStartColor,
]

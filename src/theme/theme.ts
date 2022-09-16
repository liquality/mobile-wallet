import { createTheme } from '@shopify/restyle'
import { Fonts } from '../assets'
import { palette } from './palette'

export const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    mainForeground: palette.white,
    secondaryForeground: palette.black,
    tertiaryForeground: palette.darkGray,
    buttonFontPrimary: palette.white,
    buttonFontSecondary: palette.blueVioletPrimary,
    buttonFontTertiary: palette.black,
    buttonBackgroundPrimary: palette.blueVioletPrimary,
    buttonBackgroundSecondary: palette.white,
    mainButtonBorderColor: palette.blueVioletPrimary,
    secondaryButtonBorderColor: palette.gray,
    danger: palette.red,
    spinner: palette.white,
    cardPrimaryBackground: palette.purplePrimary,
    buttonPrimaryBackground: palette.purplePrimary,
    mainBorderColor: palette.gray,
    link: palette.blueVioletPrimary,
    transparentBlack: palette.transparentBlack,
    progressDotColor: palette.turquoise,
    addressColor: palette.black2,
    errorMsgBarColor: palette.yellowBar,
  },
  spacing: {
    vs: 2,
    s: 5,
    m: 10,
    l: 15,
    xl: 20,
    xxl: 70,
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
      color: 'liqPink',
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
      fontFamily: Fonts.AlternatesLight,
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
      fontWeight: 'bold',
      fontSize: 12,
      lineHeight: 18,
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
      lineHeight: 14,
      color: 'buttonFontPrimary',
    },
    tertiaryButtonLabel: {
      fontFamily: Fonts.Regular,
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 12,
      color: 'buttonFontTertiary',
    },
    amount: {
      fontFamily: Fonts.Regular,
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 14,
      color: 'secondaryForeground',
    },
    amountLarge: {
      fontFamily: Fonts.Regular,
      fontWeight: '300',
      fontSize: 28,
      lineHeight: 42,
    },
    amountLabel: {
      fontFamily: Fonts.Light,
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 14,
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
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 16,
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
      fontFamily: Fonts.AlternatesLight,
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
      paddingVertical: 'm',
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
  textInputVariants: {},
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

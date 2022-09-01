import { createTheme } from '@shopify/restyle'

export const palette = {
  black: '#1D1E21',
  black2: '#000D35',
  white: '#FFFFFF',
  gray: '#D9DFE5',
  darkGray: '#646F85',
  blueVioletPrimary: '#9D4DFA',
  blueVioletSecondary: '#F8FAFF',
  purplePrimary: '#5A31F4',
  red: '#F12274',
  transparentBlack: 'rgba(0,0,0,0.5)',
  turquoise: '#2CD2CF',
  liqPink: '#FF007A',
  yellowBar: '#FFF8DA',
}

const theme = createTheme({
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
      fontFamily: 'Montserrat-Regular',
      fontSize: 12,
      fontWeight: '700',
      lineHeight: 18,
      marginVertical: 's',
      marginRight: 's',
      color: 'secondaryForeground',
    },
    pinkText: {
      fontFamily: 'Montserrat-Regular',
      color: 'liqPink',
      fontWeight: '600',
      fontSize: 20,
    },
    tabHeader: {
      fontFamily: 'Montserrat-Regular',
      fontSize: 13,
      fontWeight: '600',
      color: 'secondaryForeground',
    },
    content: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '300',
      fontSize: 12,
      color: 'tertiaryForeground',
    },
    label: {
      fontFamily: 'Montserrat-Regular',
      fontSize: 13,
      fontWeight: '600',
      color: 'secondaryForeground',
      marginBottom: 's',
    },
    slogan1: {
      fontFamily: 'Montserrat-Light',
      color: 'mainForeground',
      fontSize: 24,
    },
    slogan2: {
      fontFamily: 'MontserratAlternates-Light',
      color: 'mainForeground',
      fontSize: 55,
      marginVertical: 'l',
    },
    description: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '600',
      fontSize: 14,
      lineHeight: 24,
      color: 'mainForeground',
    },
    mainInputLabel: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 'bold',
      fontSize: 12,
      lineHeight: 18,
      color: 'mainForeground',
    },
    secondaryInputLabel: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '700',
      fontSize: 12,
      lineHeight: 18,
      color: 'secondaryForeground',
      marginBottom: 's',
    },
    body: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '600',
      fontSize: 14,
      lineHeight: 24,
      color: 'secondaryForeground',
    },
    mainButtonLabel: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '600',
      fontSize: 14,
      lineHeight: 14,
      color: 'buttonFontPrimary',
    },
    tertiaryButtonLabel: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 12,
      color: 'buttonFontTertiary',
    },
    amount: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 14,
      color: 'secondaryForeground',
    },
    amountLarge: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '300',
      fontSize: 28,
      lineHeight: 42,
    },
    amountLabel: {
      fontFamily: 'Montserrat-Light',
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 14,
      color: 'tertiaryForeground',
    },
    warningBold: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '500',
      fontSize: 10,
      lineHeight: 16,
    },
    warningLight: {
      fontFamily: 'Montserrat-Light',
      fontWeight: '300',
      fontSize: 10,
      lineHeight: 16,
      paddingLeft: 's',
    },
    link: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 16,
      color: 'link',
    },
    boldLink: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '600',
      fontSize: 12,
      lineHeight: 16,
      color: 'link',
    },
    timelineLabel: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '300',
      fontSize: 12,
      lineHeight: 18,
      marginRight: 's',
    },
    address: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '300',
      fontSize: 12,
      lineHeight: 18,
      color: 'addressColor',
    },
    error: {
      fontFamily: 'Montserrat-Light',
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
      fontFamily: 'Montserrat-Regular',
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
      fontFamily: 'MontserratAlternates-Light',
      color: 'mainForeground',
      fontSize: 35,
      textAlign: 'center',
      marginVertical: 'l',
    },
    loading: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '400',
      fontSize: 28,
      color: 'mainForeground',
      textAlign: 'center',
      marginHorizontal: 'xl',
      marginTop: 'l',
      lineHeight: 28,
    },
    settingLabel: {
      fontFamily: 'Montserrat-Regular',
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
  cardVariants: {},
  dropDownVariants: {
    language: {
      width: '50%',
      borderBottomColor: 'progressDotColor',
      borderBottomWidth: 1,
    },
  },
  textInputVariants: {},
})

export type Theme = typeof theme
export default theme

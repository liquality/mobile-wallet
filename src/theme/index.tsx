import { createTheme } from '@shopify/restyle'

const palette = {
  black: '#1D1E21',
  white: '#FFFFFF',

  blueVioletPrimary: '#9D4DFA',
  blueVioletSecondary: '#F8FAFF',

  purpleLight: '#8C6FF7',
  purplePrimary: '#5A31F4',

  red: '#F12274',

  purpleDark: '#3F22AB',
  greenLight: '#56DCBA',
  greenPrimary: '#0ECD9D',

  greenDark: '#0A906E',
}

const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    mainForeground: palette.white,
    secondaryForeground: palette.black,
    buttonFontPrimary: palette.white,
    buttonFontSecondary: palette.blueVioletPrimary,
    buttonFontTertiary: palette.black,
    buttonBackgroundPrimary: palette.blueVioletPrimary,
    buttonBackgroundSecondary: palette.white,
    mainButtonBorderColor: palette.blueVioletPrimary,
    secondaryButtonBorderColor: palette.black,
    danger: palette.red,
    spinner: palette.white,
    cardPrimaryBackground: palette.purplePrimary,
    buttonPrimaryBackground: palette.purplePrimary,
  },
  spacing: {
    s: 5,
    m: 10,
    l: 15,
    xl: 20,
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
      fontSize: 28,
      lineHeight: 24,
      color: 'mainForeground',
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
    },
    body: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '600',
      fontSize: 14,
      lineHeight: 24,
      color: 'mainForeground',
    },
    mainButtonLabel: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '600',
      fontSize: 14,
      lineHeight: 10,
      color: 'buttonFontPrimary',
      paddingVertical: 'l',
    },
    tertiaryButtonLabel: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 12,
      color: 'buttonFontTertiary',
    },
    error: {
      fontFamily: 'Montserrat-Light',
      color: 'danger',
      fontSize: 12,
      backgroundColor: 'buttonBackgroundSecondary',
      textAlignVertical: 'center',
      marginTop: 5,
      paddingLeft: 5,
      paddingVertical: 5,
      marginHorizontal: 20,
      height: 25,
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
      height: 35,
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
  cardVariants: {},
})

export type Theme = typeof theme
export default theme

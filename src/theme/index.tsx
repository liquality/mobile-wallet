import { createTheme } from '@shopify/restyle'

const palette = {
  black: '#1D1E21',
  white: '#FFFFFF',
  gray: '#D9DFE5',
  darkGray: '#646F85',
  blueVioletPrimary: '#9D4DFA',
  blueVioletSecondary: '#F8FAFF',
  purplePrimary: '#5A31F4',
  red: '#F12274',
  transparentBlack: 'rgba(0,0,0,0.5)',
  turquoise: '#2CD2CF',
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
      fontSize: 12,
      fontWeight: '700',
      lineHeight: 18,
      marginVertical: 's',
      marginRight: 's',
      color: 'secondaryForeground',
    },
    tabHeader: {
      fontFamily: 'Montserrat-Regular',
      fontSize: 13,
      fontWeight: '600',
      color: 'mainForeground',
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
    amount: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 14,
      color: 'secondaryForeground',
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
    error: {
      fontFamily: 'Montserrat-Light',
      color: 'danger',
      fontSize: 12,
      marginTop: 's',
      paddingLeft: 's',
      paddingVertical: 's',
      marginHorizontal: 'xl',
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
  },
  cardVariants: {},
})

export type Theme = typeof theme
export default theme

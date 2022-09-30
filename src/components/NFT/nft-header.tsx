import { Dimensions, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { AppIcons, Fonts } from '../../assets'
import { Box, faceliftPalette, palette } from '../../theme'
import { Text } from '../text/text'
import Svg from 'react-native-svg'
import fonts from '../../assets/fonts'

const { SignOut } = AppIcons

type NftHeaderProps = {
  blackText: string
  greyText: string
  width: number
  height: number
  isFullPage?: boolean
}

const NftHeader: React.FC<NftHeaderProps> = (props) => {
  const { width, height, isFullPage, blackText, greyText } = props

  const renderAllNftsHeaderText = () => {
    return (
      <Box>
        <Text style={styles.blackText}>
          {blackText} {'\n'}
          <Text style={[styles.blackText, styles.greyText]}>{greyText}</Text>
        </Text>
      </Box>
    )
  }
  return (
    <Box width={width} height={height} style={styles.insideHeader}>
      {renderAllNftsHeaderText()}
    </Box>
  )
}

const styles = StyleSheet.create({
  containerBox: { overflow: 'hidden', paddingBottom: 5 },

  insideHeader: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    position: 'relative',
  },
  blackText: {
    position: 'absolute',
    left: 20,
    top: 120,
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 40,
    letterSpacing: 0.25,
  },
  greyText: {
    marginVertical: 0,
    paddingTop: 10,
    color: faceliftPalette.grey, //TODO import from palette
    lineHeight: 35,
  },
})

export default NftHeader

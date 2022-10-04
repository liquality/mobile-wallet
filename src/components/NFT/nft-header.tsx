import { StyleSheet } from 'react-native'
import React from 'react'
import { Fonts } from '../../assets'
import { Box, faceliftPalette } from '../../theme'
import { Text } from '../text/text'

type NftHeaderProps = {
  blackText: string
  greyText: string
  width: number
  height: number
}

const NftHeader: React.FC<NftHeaderProps> = (props) => {
  const { width, height, blackText, greyText } = props

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
    left: 20,
    top: 120,
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 35,
    letterSpacing: 0.25,
  },
  greyText: {
    marginVertical: 0,
    paddingTop: 10,
    color: faceliftPalette.grey,
    lineHeight: 35,
  },
})

export default NftHeader

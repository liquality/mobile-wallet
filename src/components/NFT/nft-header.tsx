import { Dimensions, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { AppIcons } from '../../assets'
import { Box, palette } from '../../theme'
import { Text } from '../text/text'
import Svg from 'react-native-svg'

const { SignOut } = AppIcons

type NftHeaderProps = {
  width: number
  height: number
  isFullPage?: boolean
}

const NftHeader: React.FC<NftHeaderProps> = (props) => {
  const { width, height, isFullPage } = props

  const renderAllNftsHeaderText = () => {
    return (
      <Box flex="1" flexDirection="column">
        <Text style={styles.nftText}>X NFTS</Text>
        <Text style={[styles.nftText, styles.accountText]}>X ACCOUNTS</Text>
      </Box>
    )
  }
  return (
    <Box style={styles.containerBox}>
      <Box width={width} height={height} style={styles.insideHeader}>
        {renderAllNftsHeaderText()}
      </Box>
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
  },
  nftText: {
    padding: 20,
    paddingBottom: 0,
    marginVertical: 105,
    //TODO add this font fontFamily: 'Anek Kannada',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 40,
    lineHeight: 35,
    color: '#000000',
    marginBottom: 0,
  },
  accountText: {
    marginVertical: 0,
    paddingTop: 10,
    color: '#A8AEB7', //TODO import from palette
  },
})

export default NftHeader

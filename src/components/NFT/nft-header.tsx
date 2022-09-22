import { Dimensions, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { AppIcons } from '../../assets'
import { Box } from '../../theme'
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

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      style={StyleSheet.absoluteFill}>
      <Box
        style={styles.insideHeader}
        width={`${width}`}
        height={`${height}`}
        fill="none">
        <Text>Hej</Text>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  signOutBtn: {
    marginRight: 20,
  },
  insideHeader: {
    width: width,
  },
  header: {
    width: Dimensions.get('screen').width,

    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: '0%',
    right: '0%',
    top: '0%',
    bottom: '0%',
    background: '#FFFFFF',
    boxShadow: '0px 0px 24px 7px rgba(0, 0, 0, 0.08)',
    zIndex: 100,
  },
})

export default NftHeader

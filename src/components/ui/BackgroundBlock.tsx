import { Box, faceliftPalette } from '../../theme'
import { StyleSheet } from 'react-native'
import { Path, Svg } from 'react-native-svg'
import React from 'react'

type BackgroundBlockProps = {
  width: number
  height: number
}

const BackgroundBlock = (props: BackgroundBlockProps) => {
  const { width, height } = props
  const flatRadius = 60
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      shadowColor={'darkGrey'}
      shadowOffset={{ width: 4, height: 6 }}
      shadowOpacity={1}
      shadowRadius={0}
      elevation={2}
      style={StyleSheet.absoluteFillObject}>
      <Svg
        width={`${width}`}
        height={`${height}`}
        viewBox={`0 0 ${width} ${height}`}
        fill="none">
        <Path
          d={`M0 0 H ${
            width - flatRadius
          } L ${width} ${flatRadius} V ${height} H ${0} V ${0} Z`}
          fill={faceliftPalette.white}
          strokeWidth={4}
          stroke={faceliftPalette.darkGrey}
          strokeLinejoin={'round'}
          strokeLinecap={'round'}
        />
      </Svg>
    </Box>
  )
}

export default BackgroundBlock

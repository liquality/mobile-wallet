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
  const flatRadius = 50
  const SHADOW_WIDTH = 6

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      paddingRight={'s'}
      style={StyleSheet.absoluteFillObject}>
      <Svg
        width={`${width}`}
        height={`${height}`}
        viewBox={`0 0 ${width} ${height}`}
        fill="none">
        <Path
          d={`M10 70 H ${width} V ${height} H ${10} V ${70} Z`}
          fill={faceliftPalette.darkGrey}
          strokeWidth={4}
          stroke={faceliftPalette.darkGrey}
          strokeLinejoin={'round'}
          strokeLinecap={'round'}
        />
        <Path
          d={`M0 0 H ${width - flatRadius} L ${
            width - SHADOW_WIDTH
          } ${flatRadius} V ${height - SHADOW_WIDTH} H ${0} V ${0} Z`}
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

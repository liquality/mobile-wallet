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
          d={`
          M10 70 
          H ${width - 5}
          Q ${width},70 ${width},79 
          V ${height - 9} 
          Q ${width},${height} ${width - 9},${height} 
          H ${19} 
          Q ${10}, ${height} 
            ${10}, ${height - 9}
          V ${70} 
          Z`}
          fill={faceliftPalette.darkGrey}
          strokeWidth={4}
          stroke={faceliftPalette.darkGrey}
          strokeLinejoin={'round'}
          strokeLinecap={'round'}
        />
        <Path
          d={`
          M10 0 
          H ${width - flatRadius} 
          L ${width - SHADOW_WIDTH} ${flatRadius} 
          V ${height - SHADOW_WIDTH - 9}
          Q ${width - SHADOW_WIDTH}, ${height - SHADOW_WIDTH} 
            ${width - SHADOW_WIDTH - 9}, ${height - SHADOW_WIDTH} 
          H ${9} 
          Q ${0}, ${height - SHADOW_WIDTH} 
            ${0}, ${height - SHADOW_WIDTH - 9}
          V ${9} 
          Q ${0}, ${0} 
            ${9}, ${0}
          Z
          `}
          fill={faceliftPalette.white}
          strokeWidth={3}
          stroke={faceliftPalette.darkGrey}
        />
      </Svg>
    </Box>
  )
}

export default BackgroundBlock

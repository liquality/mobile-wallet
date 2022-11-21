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
  const FLAT_RADIUS = 50
  const SHADOW_WIDTH = 6
  const TILE_OFFSET = 70

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
          M10 ${TILE_OFFSET} 
          H ${width - 5}
          Q ${width},${TILE_OFFSET} ${width},${TILE_OFFSET + 9} 
          V ${height - 9} 
          Q ${width},${height} ${width - 9},${height} 
          H ${19} 
          Q ${10}, ${height} 
            ${10}, ${height - 9}
          V ${TILE_OFFSET} 
          Z`}
          fill={faceliftPalette.darkGrey}
        />
        <Path
          d={`
          M10 0 
          H ${width - FLAT_RADIUS} 
          L ${width - SHADOW_WIDTH} ${FLAT_RADIUS} 
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

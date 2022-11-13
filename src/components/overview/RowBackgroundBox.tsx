import { Box, faceliftPalette } from '../../theme'
import { StyleSheet } from 'react-native'
import { Path, Svg } from 'react-native-svg'
import React from 'react'

type RowBackgroundBoxProps = {
  width: number
  height: number
}

const RowBackgroundBox = (props: RowBackgroundBoxProps) => {
  const { width, height } = props
  const flatRadius = 20

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      style={StyleSheet.absoluteFillObject}>
      <Svg
        width={`${width}`}
        height={`${height}`}
        viewBox={`0 0 ${width} ${height}`}
        fill={faceliftPalette.white}>
        <Path
          d={`M0 0 H ${
            width - flatRadius
          } L ${width} ${flatRadius} V ${height} H ${0} V ${0} Z`}
          strokeWidth={2}
          stroke={faceliftPalette.whiteGrey}
          strokeLinejoin={'round'}
          strokeLinecap={'round'}
        />
      </Svg>
    </Box>
  )
}

export default RowBackgroundBox

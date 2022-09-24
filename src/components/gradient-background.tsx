import { StyleSheet } from 'react-native'
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg'
import React, { FC, memo } from 'react'
import { Box, faceliftPalette } from '../theme'

interface Props {
  width: number
  height: number
  isFullPage?: boolean
}

const GradientBackground: FC<Props> = (props) => {
  const { width, height, isFullPage } = props

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      style={StyleSheet.absoluteFill}>
      <Svg
        width={`${width}`}
        height={`${height}`}
        viewBox={`0 0 ${width} ${height}`}
        fill="none">
        <Defs>
          {isFullPage ? (
            <LinearGradient
              id="paint0_linear_1987_2554"
              x1={-93.1915}
              y1={858.242}
              x2={-93.1915}
              y2={-1.60436e-7}
              gradientUnits="userSpaceOnUse">
              <Stop stopColor={faceliftPalette.gradientStartColor} />
              <Stop
                offset={0.55}
                stopColor={faceliftPalette.gradientMiddeColor}
              />
              <Stop
                offset={0.95}
                stopColor={faceliftPalette.gradientEndColor}
              />
            </LinearGradient>
          ) : (
            <LinearGradient
              id="paint0_linear_1987_2554"
              x1={-92.8746}
              y1={301}
              x2={-92.8745}
              y2={-1.15427e-5}
              gradientUnits="userSpaceOnUse">
              <Stop stopColor={faceliftPalette.gradientStartColor} />
              <Stop
                offset="0.385417"
                stopColor={faceliftPalette.gradientMiddeColor}
              />
              <Stop
                offset="0.833333"
                stopColor={faceliftPalette.gradientEndColor}
              />
            </LinearGradient>
          )}
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#paint0_linear_1987_2554)"
        />
      </Svg>
    </Box>
  )
}

export default memo(GradientBackground)

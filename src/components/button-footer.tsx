import React, { Children } from 'react'
import { StyleSheet } from 'react-native'
import { Box } from '../theme'

type ButtonFooterProps = {
  children: React.ReactElement[]
  unpositioned?: boolean
}

const ButtonFooter: React.FC<ButtonFooterProps> = ({
  children,
  unpositioned,
}) => {
  return (
    <Box
      flexDirection={'column'}
      justifyContent="center"
      paddingBottom={'m'}
      style={!unpositioned && styles.container_absolute}>
      {Children.map(children, (child, key) => (
        <Box key={key}>{child}</Box>
      ))}
    </Box>
  )
}

const styles = StyleSheet.create({
  container_absolute: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
})

export default ButtonFooter

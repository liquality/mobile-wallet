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
      paddingHorizontal="l"
      style={!unpositioned && styles.container_absolute}>
      {Children.map(children, (child, key) => (
        <Box key={key} style={styles.item}>
          {child}
        </Box>
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
  item: {
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
  },
})

export default ButtonFooter

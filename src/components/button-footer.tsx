import React, { Children } from 'react'
import { View, StyleSheet } from 'react-native'

type ButtonFooterProps = {
  unpositioned?: boolean
}

const ButtonFooter: React.FC<ButtonFooterProps> = ({
  children,
  unpositioned,
}) => {
  return (
    <View
      style={[styles.container, !unpositioned && styles.container_absolute]}>
      {Children.map(children, (child, key) => (
        <View key={key} style={styles.item}>
          {child}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 30,
  },
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

import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Bars from '../../assets/icons/menu-bars.svg'

const OverviewHeaderRight = ({
  onPress,
}: {
  onPress: () => void
}): React.ReactElement => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <Bars width={25} height={25} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default OverviewHeaderRight

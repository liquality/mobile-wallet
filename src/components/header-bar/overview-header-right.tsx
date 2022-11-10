import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { AppIcons } from '../../assets'

const { Bars } = AppIcons

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
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
})

export default OverviewHeaderRight

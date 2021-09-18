import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OverviewHeaderLeft = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.overviewText}>OVERVIEW</Text>
      <Text style={styles.chainText}>(MAINNET)</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  overviewText: {
    fontWeight: '600',
  },
  chainText: {
    fontWeight: '300',
  },
})

export default OverviewHeaderLeft

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAppSelector } from '../../hooks'

const OverviewHeaderLeft = (): React.ReactElement => {
  const { activeNetwork = '' } = useAppSelector((state) => ({
    activeNetwork: state.activeNetwork,
  }))
  return (
    <View style={styles.container}>
      <Text style={styles.overviewText}>OVERVIEW</Text>
      <Text style={styles.chainText}>({activeNetwork.toUpperCase()})</Text>
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
    marginLeft: 5,
  },
})

export default OverviewHeaderLeft

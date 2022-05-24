import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import ChevronLeft from '../../assets/icons/chevron-left.svg'

import { useAppSelector } from '../../hooks'

const OverviewHeaderLeft = ({
  includeBackBtn,
  goBack,
  screenTitle,
}: {
  includeBackBtn: boolean
  goBack: () => void
  screenTitle: string
}): React.ReactElement => {
  const { activeNetwork = '' } = useAppSelector((state) => ({
    activeNetwork: state.activeNetwork,
  }))
  return (
    <View style={styles.container}>
      {includeBackBtn && (
        <Pressable style={styles.backBtn} onPress={goBack}>
          <ChevronLeft width={12} height={12} />
        </Pressable>
      )}
      <Text style={styles.overviewText}>{screenTitle.toUpperCase()}</Text>
      <Text style={styles.chainText}>({activeNetwork.toUpperCase()})</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  overviewText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    fontWeight: '600',
  },
  chainText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    fontWeight: '300',
    marginLeft: 5,
  },
  backBtn: {
    marginRight: 15,
  },
})

export default OverviewHeaderLeft

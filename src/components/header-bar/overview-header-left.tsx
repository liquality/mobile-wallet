import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import ChevronLeft from '../../assets/icons/chevron-left.svg'

import { networkState } from '../../atoms'
import { useRecoilValue } from 'recoil'
import Box from '../../theme/box'

const OverviewHeaderLeft = ({
  includeBackBtn,
  goBack,
  screenTitle,
}: {
  includeBackBtn: boolean
  goBack: () => void
  screenTitle: string
}): React.ReactElement => {
  const activeNetwork = useRecoilValue(networkState)
  return (
    <Box flexDirection="row">
      {includeBackBtn && (
        <Pressable style={styles.backBtn} onPress={goBack}>
          <ChevronLeft width={12} height={12} />
        </Pressable>
      )}
      <Text style={styles.overviewText}>{screenTitle.toUpperCase()}</Text>
      <Text style={styles.chainText}>({activeNetwork.toUpperCase()})</Text>
    </Box>
  )
}

const styles = StyleSheet.create({
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

import React, { FC } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { networkState } from '../../atoms'
import { useRecoilValue } from 'recoil'
import { Box } from '../../theme'
import { AppIcons, Fonts } from '../../assets'

const { ChevronLeft } = AppIcons

type OverviewHeaderLeftProps = {
  includeBackBtn: boolean
  goBack: () => void
  screenTitle: string
}

const OverviewHeaderLeft: FC<OverviewHeaderLeftProps> = (
  props,
): React.ReactElement => {
  const { includeBackBtn, goBack, screenTitle } = props
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
    fontFamily: Fonts.Regular,

    fontSize: 14,
    fontWeight: '600',
  },
  chainText: {
    fontFamily: Fonts.Regular,

    fontSize: 14,
    fontWeight: '300',
    marginLeft: 5,
  },
  backBtn: {
    marginRight: 15,
  },
})

export default OverviewHeaderLeft

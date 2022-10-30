import { Pressable, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Svg, { Circle, Line } from 'react-native-svg'
import { formatDate } from '../../utils'
import Label from '../ui/label'
import { TimelineStep } from '@liquality/wallet-core/dist/src/utils/timeline'
import { SwapHistoryItem } from '@liquality/wallet-core/dist/src/store/types'
import { getTimeline } from '../../store/store'
import { Text, Box, palette, faceliftPalette } from '../../theme'
import Timeline from './timeline'
import { useRecoilValue } from 'recoil'
import { fiatRatesState } from '../../atoms'

export const EmptyBlock = () => <View style={styles.emptyBlock} />

export const Step = ({ completed }: { completed: boolean }) => (
  <Box marginVertical={'s'}>
    <Svg height="16" width="16">
      <Circle
        cx="8"
        cy="8"
        r="8"
        fill={completed ? faceliftPalette.buttonDisabled : palette.nestedColor}
      />
    </Svg>
  </Box>
)

export const Separator = () => (
  <View>
    <Svg height="75" width="10">
      <Line
        x1={5}
        y1={0}
        x2={5}
        y2={75}
        strokeWidth={1}
        stroke={faceliftPalette.greyBlack}
      />
    </Svg>
  </View>
)

type SwapTransactionDetailsProps = {
  historyItem: SwapHistoryItem
}
const SwapTransactionDetails: React.FC<SwapTransactionDetailsProps> = (
  props,
): React.ReactElement => {
  const { historyItem } = props
  const fiatRates = useRecoilValue(fiatRatesState)
  const [timeline, setTimeline] = useState<TimelineStep[]>()

  const handleTransactionCancellation = () => {
    //TODO display gas fee selector
  }

  useEffect(() => {
    if (!historyItem) {
      return
    }
    getTimeline(historyItem).then(setTimeline)
  }, [historyItem])

  if (!timeline) {
    return (
      <Box justifyContent="space-between" paddingHorizontal="xl" marginTop="xl">
        <Text tx="common.loading" />
      </Box>
    )
  }

  return (
    <Box justifyContent="space-between" paddingHorizontal="xl" marginTop="xl">
      <Box justifyContent="center" alignItems="center">
        <Text variant="timelineLabel">{formatDate(historyItem.startTime)}</Text>
        <Label text={{ tx: 'common.started' }} variant="strong" />
        {!['SUCCESS', 'REFUNDED'].includes(historyItem.status) && (
          <Pressable onPress={handleTransactionCancellation}>
            <Text variant="link" tx="common.cancel" />
          </Pressable>
        )}
      </Box>

      <Timeline
        timeline={timeline}
        historyItem={historyItem}
        fiatRates={fiatRates}
      />
      {['SUCCESS', 'REFUNDED'].includes(historyItem.status?.toUpperCase()) && (
        <Box justifyContent="center" alignItems="center">
          <Label text={{ tx: 'common.completed' }} variant="strong" />
          <Text variant="timelineLabel">
            {historyItem.endTime && formatDate(historyItem.endTime)}
          </Text>
        </Box>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  emptyBlock: {
    width: '45%',
  },
})

export default SwapTransactionDetails

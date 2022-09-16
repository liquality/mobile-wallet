import { Pressable, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Svg, { Circle, Line } from 'react-native-svg'
import { formatDate } from '../../utils'
import Label from '../ui/label'
import { TimelineStep } from '@liquality/wallet-core/dist/src/utils/timeline'
import { SwapHistoryItem } from '@liquality/wallet-core/dist/src/store/types'
import { getTimeline } from '../../store/store'
import { Text, Box, palette } from '../../theme'
import Timeline from './timeline'
import { useRecoilValue } from 'recoil'
import { fiatRatesState } from '../../atoms'

export const EmptyBlock = () => <View style={styles.emptyBlock} />

export const Step = ({ completed }: { completed: boolean }) => (
  <View>
    <Svg height="10" width="10">
      <Circle
        cx="5"
        cy="5"
        r="5"
        fill={completed ? palette.turquoise : palette.nestedColor}
      />
    </Svg>
  </View>
)

export const Separator = ({ completed }: { completed: boolean }) => (
  <View>
    <Svg height="50" width="10">
      <Line
        x1={5}
        y1={0}
        x2={5}
        y2={50}
        strokeWidth={2}
        strokeDasharray={[1, 1]}
        fill="none"
        stroke={completed ? palette.turquoise : palette.nestedColor}
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

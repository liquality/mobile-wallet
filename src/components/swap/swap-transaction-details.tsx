import { Pressable, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Svg, { Circle, Line } from 'react-native-svg'
import { formatDate } from '../../utils'
import { v4 as uuidv4 } from 'uuid'
import { useAppSelector } from '../../hooks'
import Label from '../ui/label'
import { TimelineStep } from '@liquality/wallet-core/dist/utils/timeline'
import { SwapHistoryItem } from '@liquality/wallet-core/dist/store/types'
import { getTimeline } from '../../store/store'
import Box from '../../theme/box'
import Text from '../../theme/text'
import ConfirmationBlock from './confirmation-block'

export const EmptyBlock = () => <View style={styles.emptyBlock} />

export const Step = ({ completed }: { completed: boolean }) => (
  <View>
    <Svg height="10" width="10">
      <Circle cx="5" cy="5" r="5" fill={completed ? '#2CD2CF' : '#A8AEB7'} />
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
        stroke={completed ? '#2CD2CF' : '#A8AEB7'}
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
  const { fiatRates } = useAppSelector((state) => ({
    fiatRates: state.fiatRates,
  }))
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
        <Text>Loading</Text>
      </Box>
    )
  }

  return (
    <Box justifyContent="space-between" paddingHorizontal="xl" marginTop="xl">
      <Box justifyContent="center" alignItems="center">
        <Text variant="timelineLabel">{formatDate(historyItem.startTime)}</Text>
        <Label text="Started" variant="strong" />
        {!['SUCCESS', 'REFUNDED'].includes(historyItem.status) && (
          <Pressable onPress={handleTransactionCancellation}>
            <Text variant="link">Cancel</Text>
          </Pressable>
        )}
      </Box>

      {timeline.map((item, index) => {
        const isStepCompleted =
          typeof item.pending !== 'undefined' && !item.pending
        return (
          <Box
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            key={uuidv4()}>
            {index % 2 === 0 && historyItem ? (
              <ConfirmationBlock
                address={historyItem.fromAddress}
                status={item.title}
                confirmations={item.tx?.confirmations || 0}
                fee={item.tx?.fee}
                asset={historyItem.from}
                fiatRates={fiatRates}
                url={item.tx?.explorerLink}
              />
            ) : (
              <EmptyBlock />
            )}
            <Box
              justifyContent="flex-start"
              alignItems="center"
              width="4%"
              marginHorizontal="l">
              {index === 0 && (
                <>
                  <View style={styles.start} />
                  <Separator completed={isStepCompleted} />
                </>
              )}
              {index !== 0 && <Separator completed={isStepCompleted} />}
              <Step completed={isStepCompleted} />
              {index === timeline.length - 1 ? (
                <View style={styles.start} />
              ) : (
                <Separator completed={isStepCompleted} />
              )}
            </Box>
            {index % 2 === 1 ? (
              <ConfirmationBlock
                address={historyItem.toAddress}
                status={item.title}
                confirmations={item.tx?.confirmations || 0}
                fee={item.tx?.fee}
                asset={historyItem.to}
                fiatRates={fiatRates}
                url={item.tx?.explorerLink}
              />
            ) : (
              <EmptyBlock />
            )}
          </Box>
        )
      })}

      {['SUCCESS', 'REFUNDED'].includes(historyItem.status?.toUpperCase()) && (
        <Box justifyContent="center" alignItems="center">
          <Label text="Completed" variant="strong" />
          <Text variant="timelineLabel">
            {historyItem.endTime && formatDate(historyItem.endTime)}
          </Text>
        </Box>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  start: {
    width: 10,
    height: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#2CD2CF',
  },
  emptyBlock: {
    width: '45%',
  },
})

export default SwapTransactionDetails

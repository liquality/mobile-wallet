import React from 'react'
import { TimelineStep } from '@liquality/wallet-core/dist/src/utils/timeline'
import {
  FiatRates,
  SwapHistoryItem,
} from '@liquality/wallet-core/dist/src/store/types'
import Box from '../../theme/box'
import { v4 as uuidv4 } from 'uuid'
import ConfirmationBlock from './confirmation-block'
import { StyleSheet, View } from 'react-native'
import { EmptyBlock, Separator, Step } from './swap-transaction-details'

const TimelineComponent: React.FC<{
  timeline: TimelineStep[]
  historyItem: SwapHistoryItem
  fiatRates: FiatRates
}> = (props) => {
  const { timeline, historyItem, fiatRates } = props
  return (
    <>
      {timeline.map((item, index) => {
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
                txHash={historyItem.id}
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
                  <Separator completed={item.completed} />
                </>
              )}
              {index !== 0 && <Separator completed={item.completed} />}
              <Step completed={item.completed} />
              {index === timeline.length - 1 ? (
                <View style={styles.start} />
              ) : (
                <Separator completed={item.completed} />
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
    </>
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
})

export default React.memo(TimelineComponent)

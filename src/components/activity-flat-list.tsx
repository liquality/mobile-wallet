import * as React from 'react'
import {
  HistoryItem,
  TransactionType,
} from '@liquality/wallet-core/dist/src/store/types'
import ActivityFilter from './activity-filter'
import { useFilteredHistory } from '../custom-hooks'
import { labelTranslateFn } from '../utils'
import { useNavigation } from '@react-navigation/core'
import { OverviewProps } from '../screens/wallet-features/home/overview-screen'
import { useRecoilValue } from 'recoil'
import { showFilterState } from '../atoms'
import { Text, Box, Pressable } from '../theme'
import HistoryItemComponent from './overview/history-item-component'

const ActivityFlatList = ({
  selectedAsset,
  historyCount = 0,
}: {
  selectedAsset?: string
  historyCount?: number
}) => {
  const navigation = useNavigation<OverviewProps['navigation']>()
  const historyItems = useFilteredHistory()
  const showFilter = useRecoilValue(showFilterState)

  const history = selectedAsset
    ? historyItems.filter((item) => item.from === selectedAsset)
    : historyItems.filter((item) => !!item.id)

  const handleChevronPress = React.useCallback(
    (historyItem: HistoryItem) => {
      if (historyItem.type === TransactionType.Swap) {
        navigation.navigate('SwapDetailsScreen', {
          swapTransactionConfirmation: historyItem,
          screenTitle: `Swap ${historyItem.from} to ${historyItem.to} Details`,
        })
      } else if (historyItem.type === TransactionType.Send) {
        navigation.navigate('SendConfirmationScreen', {
          sendTransactionConfirmation: historyItem,
          screenTitle: 'Send Details',
        })
      }
    },
    [navigation],
  )

  const renderActivity = React.useCallback(
    ({ item }: { item: HistoryItem }) => {
      return (
        <HistoryItemComponent
          onPress={() => handleChevronPress(item)}
          item={item}
          key={item.id}
        />
      )
    },
    [handleChevronPress],
  )

  const onBuyCryptoPress = React.useCallback(() => {
    navigation.navigate('BuyCryptoDrawer', {
      isScrolledUp: false,
      token: selectedAsset || '',
      showIntro: false,
      screenTitle: labelTranslateFn('buyCrypto')!,
    })
  }, [navigation, selectedAsset])

  return (
    <>
      {showFilter ? <ActivityFilter numOfResults={history.length} /> : null}
      {historyCount || history.length ? (
        <>
          {history.map((item) => {
            return renderActivity({ item })
          })}
        </>
      ) : (
        <Box flex={1} justifyContent="center" alignItems={'center'}>
          <Text tx="letGetYouStarted" variant={'h3'} color="textColor" />
          <Text
            marginVertical={'l'}
            variant={'activityText'}
            textAlign="center"
            color="textColor">
            Lorem ipsum dolor sit amet, consectetur incididunt ut labore et
            dolore magna aliqua.
          </Text>
          <Pressable
            label={{ tx: 'buyCrypto' }}
            onPress={onBuyCryptoPress}
            variant="defaultOutline"
            buttonSize={'half'}
          />
        </Box>
      )}
    </>
  )
}

export default ActivityFlatList

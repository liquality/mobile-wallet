import Fuse from 'fuse.js'
import { ActionEnum, TimeLimitEnum } from '../types'
import moment from 'moment'
import { HistoryItem } from '@liquality/wallet-core/dist/src/store/types'
import { useRecoilValue } from 'recoil'
import { activityFilterState, historyItemsState } from '../atoms'

const FUSE_OPTIONS = {
  includeScore: true,
  keys: ['type', 'status', 'from', 'to', 'startTime'],
}

const sortFunctionByStatus =
  (status: string) =>
  (
    { item: a }: { item: HistoryItem },
    { item: b }: { item: HistoryItem },
  ): number => {
    if (a.status === status) {
      return -1
    }

    if (b.status === status) {
      return 1
    }

    return 0
  }

const sortFunctionByField =
  (fieldIndex: number, ascending: boolean = true) =>
  (
    { item: a }: Fuse.FuseSortFunctionArg,
    { item: b }: Fuse.FuseSortFunctionArg,
  ) => {
    const aVal = (a[fieldIndex] as unknown as { v: string }).v
    const bVal = (b[fieldIndex] as unknown as { v: string }).v

    if (aVal < bVal) {
      return ascending ? -1 : 1
    }

    if (aVal > bVal) {
      return ascending ? 1 : -1
    }

    return 0
  }

const sortFunctions = {
  needs_attention: sortFunctionByStatus('NEEDS_ATTENTION'),
  pending: sortFunctionByStatus('PENDING'),
  canceled: sortFunctionByStatus('CANCELED'),
  refunded: sortFunctionByStatus('REFUNDED'),
  completed: sortFunctionByStatus('COMPLETED'),
  failed: sortFunctionByStatus('FAILED'),
  by_date: sortFunctionByField(FUSE_OPTIONS.keys.indexOf('startTime'), false),
  by_type: sortFunctionByField(FUSE_OPTIONS.keys.indexOf('type')),
  by_token: sortFunctionByField(FUSE_OPTIONS.keys.indexOf('from')),
}

export type SortFunctionKeyType =
  | 'needs_attention'
  | 'pending'
  | 'canceled'
  | 'refunded'
  | 'completed'
  | 'failed'
  | 'by_date'
  | 'by_type'
  | 'by_token'

// Fuse.js does not process an empty object or query as an inquiry for pulling all the result.
// On the other hans, we can't trigger sortFn without calling search function.
// Thus, we are sending a dummy filter, which is for getting all the results back and applying sortFn on top of it.
const dummyActivityTypeFilter = {
  $or: Object.values(ActionEnum).map((type) => ({ type: `'${type}` })),
}

const TimeLimitInSeconds = {
  [TimeLimitEnum.LAST_24HRS]: 24 * 3600,
  [TimeLimitEnum.LAST_WEEK]: 7 * 24 * 3600,
  [TimeLimitEnum.LAST_MONTH]: 31 * 24 * 3600,
}

type TimeLimitInSecondsKeyType =
  | TimeLimitEnum.LAST_24HRS
  | TimeLimitEnum.LAST_WEEK
  | TimeLimitEnum.LAST_MONTH

const useFilteredHistory = () => {
  const items = useRecoilValue(historyItemsState)
  const activityFilter = useRecoilValue(activityFilterState)
  const {
    timeLimit,
    actionTypes,
    dateRange,
    activityStatuses,
    assetToggles,
    sorter,
    codeSort,
  } = activityFilter || {}
  const { start: startDate, end: endDate } = dateRange || {}
  const sortFn = sortFunctions[
    sorter as SortFunctionKeyType
  ] as Fuse.FuseSortFunction

  const fuse = new Fuse(
    items,
    sorter
      ? {
          ...FUSE_OPTIONS,
          sortFn,
        }
      : FUSE_OPTIONS,
  )

  const activityTypeFilter = actionTypes?.length
    ? {
        $or: actionTypes.map((type: string) => ({ type: `'${type}` })),
      }
    : undefined
  const activityStatusFilter = activityStatuses?.length
    ? {
        $or: activityStatuses.map((status: string) => ({
          status: `'${status}`,
        })),
      }
    : undefined
  const assetTogglesFilter = assetToggles?.length
    ? {
        $or: [
          {
            $or: assetToggles.map((assetCode: string) => ({
              from: `'${assetCode}`,
            })),
          },
          {
            $or: assetToggles.map((assetCode: string) => ({
              to: `'${assetCode}`,
            })),
          },
        ],
      }
    : undefined

  const filtersArray = [
    activityTypeFilter,
    activityStatusFilter,
    assetTogglesFilter,
  ].filter((filter) => filter !== undefined) as Fuse.Expression[]

  let results = fuse
    .search({
      $and: filtersArray.length ? filtersArray : [dummyActivityTypeFilter],
    })
    .map(({ item }) => item)

  if (timeLimit && timeLimit !== TimeLimitEnum.ALL) {
    results = results.filter(
      (item) =>
        new Date().getTime() - Number(item.startTime) <
        TimeLimitInSeconds[timeLimit as TimeLimitInSecondsKeyType] * 1000,
    )
  }

  if (startDate || endDate) {
    results = results.filter((item) => {
      if (
        startDate &&
        moment(item.startTime).format('YYYY-MM-DD') < startDate
      ) {
        return false
      }

      return !(endDate && moment(item.startTime).format('YYYY-MM-DD') > endDate)
    })
  }

  if (codeSort) {
    if (codeSort !== 'ALL') {
      results = results.filter((history) => history.from === codeSort)
    }
  }

  return results
}

export default useFilteredHistory

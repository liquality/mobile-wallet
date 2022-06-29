import React, { FC, useCallback, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import ChevronRightIcon from '../../assets/icons/activity-status/chevron-right.svg'
import AngleRightIcon from '../../assets/icons/angle-right.svg'
import AngleDownIcon from '../../assets/icons/angle-down.svg'
import PlusSign from '../../assets/icons/plus-icon.svg'
import MinusSign from '../../assets/icons/minus-sign.svg'
import TimeIcon from '../../assets/icons/times.svg'
import ExportIcon from '../../assets/icons/export-icon.svg'

import TimeLimitOptions from './time-limit-options'
import ActionTypeToggles from './action-type-toggles'
import DateRange from './date-range'
import ActivityStatusToggles from './activity-status-toggles'
import AssetToggles from './asset-toggles'
import SectionTitle from './section-title'
import SorterPicker, { SORT_OPTIONS } from './sorter-picker'
import { ActionEnum, ActivityStatusEnum, TimeLimitEnum } from '../../types'
import { useRecoilState } from 'recoil'
import { activityFilterState } from '../../atoms'

const ActivityFilter: FC<{
  numOfResults: number
  onExport: () => void
}> = ({ numOfResults = 1, onExport }) => {
  const [expanded, setExpanded] = useState(false)
  const [moreExpanded, setMoreExpanded] = useState(false)
  const [isSortPickerOpen, setIsSortPickerOpen] = useState(false)
  const [assetFilter, setAssetFilter] = useRecoilState(activityFilterState)

  const handleUpdateFilter = useCallback(
    (payload: any) => {
      setAssetFilter((currVal) => ({ ...currVal, ...payload }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assetFilter],
  )

  const handleClearFilter = useCallback(() => {
    setAssetFilter({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangeTimeLimit = useCallback(
    (key: string) => {
      handleUpdateFilter({ timeLimit: key })
    },
    [handleUpdateFilter],
  )

  const handleChangeActionTypes = useCallback(
    (value: ActionEnum[]) => {
      handleUpdateFilter({ actionTypes: value })
    },
    [handleUpdateFilter],
  )

  const handleChangeDateRange = useCallback(
    (start: string, end: string) => {
      handleUpdateFilter({
        dateRange: {
          start,
          end,
        },
      })
    },
    [handleUpdateFilter],
  )

  const handleChangeActivityStatuses = useCallback(
    (value: ActivityStatusEnum[]) => {
      handleUpdateFilter({ activityStatuses: value })
    },
    [handleUpdateFilter],
  )

  const handleChangeAssetToggles = useCallback(
    (value: string[]) => {
      handleUpdateFilter({ assetToggles: value })
    },
    [handleUpdateFilter],
  )

  const handleShowPicker = useCallback(() => {
    setIsSortPickerOpen(true)
  }, [])

  const handlePickSorter = useCallback(
    (picked: typeof SORT_OPTIONS[0]) => {
      handleUpdateFilter({ sorter: picked.key })
      setIsSortPickerOpen(false)
    },
    [handleUpdateFilter],
  )

  const handleCancelSorter = useCallback(() => {
    setIsSortPickerOpen(false)
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.activityActionBar}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => setExpanded(!expanded)}>
          {expanded ? <AngleDownIcon /> : <AngleRightIcon />}
          <Text style={styles.filterLabel}>
            Filter ({numOfResults} {numOfResults === 1 ? ' Result' : ' Results'}
            )
          </Text>
        </Pressable>
        <Pressable style={styles.resetBtn} onPress={handleClearFilter}>
          <TimeIcon />
          <Text style={styles.resetLabel}>Reset</Text>
        </Pressable>
        <View style={styles.spacer} />
        <Pressable style={styles.iconBtn} onPress={onExport}>
          <ExportIcon width={16} fill={'#646F85'} />
          <Text style={styles.exportLabel}>Export</Text>
        </Pressable>
      </View>
      {expanded && (
        <>
          <TimeLimitOptions
            value={assetFilter?.timeLimit as TimeLimitEnum | undefined}
            onChange={handleChangeTimeLimit}
          />
          <ActionTypeToggles
            value={(assetFilter?.actionTypes || []) as ActionEnum[]}
            onChange={handleChangeActionTypes}
          />
          <Pressable
            style={styles.moreExpandButton}
            onPress={() => setMoreExpanded(!moreExpanded)}>
            {moreExpanded ? (
              <MinusSign fill="#1D1E21" width={10} />
            ) : (
              <PlusSign fill="#1D1E21" width={10} />
            )}
            <Text style={styles.filterLabel}>
              {moreExpanded ? 'less ' : 'more '} filter options
            </Text>
          </Pressable>
          {moreExpanded && (
            <>
              <DateRange
                start={assetFilter?.dateRange?.start}
                end={assetFilter?.dateRange?.end}
                onChange={handleChangeDateRange}
              />
              <ActivityStatusToggles
                value={
                  (assetFilter?.activityStatuses || []) as ActivityStatusEnum[]
                }
                onChange={handleChangeActivityStatuses}
              />
              <AssetToggles
                value={assetFilter?.assetToggles || []}
                onChange={handleChangeAssetToggles}
              />
            </>
          )}
          <View style={styles.sortBar}>
            <Text style={styles.filterLabel}>
              {numOfResults} {numOfResults === 1 ? ' Result' : ' Results'}
            </Text>
            <View style={styles.spacer} />
            <SectionTitle title="SORT" />
            <Pressable style={styles.iconBtn} onPress={handleShowPicker}>
              <Text style={styles.sorterLabel}>
                {
                  SORT_OPTIONS.find(
                    (option) => option.key === assetFilter?.sorter,
                  )?.label
                }
              </Text>
              <ChevronRightIcon width={16} height={16} />
            </Pressable>
            <SorterPicker
              isOpen={isSortPickerOpen}
              onSelect={handlePickSorter as unknown as (key: string) => void}
              onCancel={handleCancelSorter}
              value={assetFilter?.sorter}
            />
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFF',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
    paddingVertical: 11,
  },
  activityActionBar: {
    flexDirection: 'row',
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  spacer: {
    flex: 1,
  },
  filterLabel: {
    marginLeft: 5,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    color: '#1D1E21',
    fontSize: 14,
  },
  resetLabel: {
    marginLeft: 5,
    fontFamily: 'Montserrat-Regular',
    color: '#1D1E21',
    fontWeight: '300',
    fontSize: 14,
  },
  exportLabel: {
    marginLeft: 5,
    color: '#646F85',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 14,
  },
  moreExpandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    color: '#646F85',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 14,
    width: '60%',
    paddingVertical: 7,
  },
  sortBar: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sorterLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    color: '#1D1E21',
    fontSize: 14,
    marginLeft: 12,
  },
})

export default ActivityFilter

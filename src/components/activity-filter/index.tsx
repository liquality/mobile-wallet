import * as React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faChevronRight,
  faChevronDown,
  faTimes,
  faArrowToBottom,
  faPlus,
  faMinus,
} from '@fortawesome/pro-light-svg-icons'
import TimeLimitOptions from './time-limit-options'
import ActionTypeToggles from './action-type-toggles'
import DateRange from './date-range'
import ActivityStatusToggles from './activity-status-toggles'
import AssetToggles from './asset-toggles'

const ActivityFilter = ({ numOfResults = 1 }: { numOfResults: number }) => {
  const [expanded, setExpanded] = React.useState(false)
  const [moreExpanded, setMoreExpanded] = React.useState(false)
  return (
    <View style={styles.container}>
      <View style={styles.activityActionBar}>
        <Pressable
          style={styles.activityBtns}
          onPress={() => setExpanded(!expanded)}>
          <FontAwesomeIcon
            size={10}
            icon={expanded ? faChevronDown : faChevronRight}
            color={'#1D1E21'}
          />
          <Text style={styles.filterLabel}>
            Filter ({numOfResults} {numOfResults === 1 ? ' Result' : ' Results'}
            )
          </Text>
        </Pressable>
        <Pressable style={styles.resetBtn} onPress={() => {}}>
          <FontAwesomeIcon size={16} icon={faTimes} color={'#646F85'} />
          <Text style={styles.resetLabel}>Reset</Text>
        </Pressable>
        <View style={styles.spacer} />
        <Pressable style={styles.activityBtns}>
          <FontAwesomeIcon size={16} icon={faArrowToBottom} color={'#646F85'} />
          <Text style={styles.exportLabel}>Export</Text>
        </Pressable>
      </View>
      {expanded && (
        <>
          <TimeLimitOptions />
          <ActionTypeToggles />
          <Pressable
            style={styles.moreExpandButton}
            onPress={() => setMoreExpanded(!moreExpanded)}>
            <FontAwesomeIcon
              size={10}
              icon={moreExpanded ? faMinus : faPlus}
              color={'#1D1E21'}
            />
            <Text style={styles.filterLabel}>
              {moreExpanded ? 'less ' : 'more '} filter options
            </Text>
          </Pressable>
          {moreExpanded && (
            <>
              <DateRange />
              <ActivityStatusToggles />
              <AssetToggles />
            </>
          )}
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
  activityBtns: {
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
})

export default ActivityFilter

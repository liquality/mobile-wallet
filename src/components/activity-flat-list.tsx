import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faExchange } from '@fortawesome/pro-duotone-svg-icons'
import { faGreaterThan } from '@fortawesome/pro-light-svg-icons'

import * as React from 'react'
import ProgressCircle from './progress-circle'

export type ActivityDataElementType = {
  id: string
  transaction: string
  time: string
  amount: number
  status: string
}

const ActivityFlatList = ({
  activities,
  children,
}: {
  activities: Array<ActivityDataElementType>
  children: React.ReactElement
}) => {
  const renderActivity = ({ item }: { item: ActivityDataElementType }) => {
    const { transaction, amount, time, status } = item
    return (
      <View style={styles.row} key={item.id}>
        <View style={styles.col1}>
          <FontAwesomeIcon
            size={23}
            icon={faExchange}
            secondaryColor={'#FF287D'}
            color={'#2CD2CF'}
          />
        </View>
        <View style={styles.col2}>
          <Text style={styles.transaction}>{transaction}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.col3}>
          <Text style={styles.amount}>{amount}</Text>
          <Text style={styles.status}>{status}</Text>
        </View>
        <View style={styles.col4}>
          <ProgressCircle
            size={35}
            completed={2}
            color={'#D5D8DD'}
            secondaryColor={'#2CD2CF'}
          />
        </View>
        <View style={styles.col5}>
          <Pressable>
            <FontAwesomeIcon size={20} icon={faGreaterThan} color={'#A8AEB7'} />
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <FlatList
      contentContainerStyle={styles.detailsBlock}
      data={activities}
      renderItem={renderActivity}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={children}
    />
  )
}

const styles = StyleSheet.create({
  detailsBlock: {
    flex: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
    paddingVertical: 10,
  },
  col1: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  col2: {
    flex: 0.3,
    justifyContent: 'center',
  },
  col3: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 5,
  },
  col4: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  col5: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transaction: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    color: '#000',
    fontSize: 13,
    marginBottom: 5,
  },
  time: {
    fontFamily: 'Montserrat-Regular',
    color: '#646F85',
    fontSize: 12,
  },
  amount: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    color: '#000',
    fontSize: 13,
    marginBottom: 5,
  },
  status: {
    fontFamily: 'Montserrat-Regular',
    color: '#646F85',
    fontSize: 12,
  },
})

export default ActivityFlatList

import { Fragment, useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { accountsIdsState, iDoneFetchingData } from '../../atoms'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { populateWallet } from '../../store/store'
import { Pressable, StyleSheet, View } from 'react-native'
import Text from '../../theme/text'
import Box from '../../theme/box'
import ActivityFlatList from '../activity-flat-list'
import AssetFlatList from './asset-flat-list'
import * as React from 'react'

const ContentBlock = () => {
  enum ViewKind {
    ASSETS,
    ACTIVITY,
  }
  const [selectedView, setSelectedView] = useState(ViewKind.ASSETS)
  const accountsIds = useRecoilValue(accountsIdsState)
  const setIsDoneFetchingData = useSetRecoilState(iDoneFetchingData)

  useEffect(() => {
    AsyncStorage.getItem('BTC').then((result) => {
      if (result) {
        setTimeout(
          () =>
            populateWallet().then(() => {
              setIsDoneFetchingData(true)
            }),
          3000,
        )
      } else {
        populateWallet().then(() => {
          setIsDoneFetchingData(true)
        })
      }
    })
  }, [setIsDoneFetchingData])

  return (
    <Fragment>
      <View style={styles.tabsBlock}>
        <Pressable
          style={[
            styles.tabHeader,
            selectedView === ViewKind.ASSETS && styles.headerFocused,
          ]}
          onPress={() => setSelectedView(ViewKind.ASSETS)}>
          <Text style={styles.headerText}>ASSET</Text>
        </Pressable>
        <Pressable
          style={[
            styles.tabHeader,
            selectedView === ViewKind.ACTIVITY && styles.headerFocused,
          ]}
          onPress={() => setSelectedView(ViewKind.ACTIVITY)}>
          <Text style={styles.headerText}>ACTIVITY</Text>
        </Pressable>
      </View>
      <Box flex={1}>
        {selectedView === ViewKind.ACTIVITY &&
          (accountsIds.length > 0 ? (
            <ActivityFlatList />
          ) : (
            <Text style={styles.noActivityMessageBlock}>
              Once you start using your wallet you will see the activity here.
            </Text>
          ))}
        {selectedView === ViewKind.ASSETS && accountsIds && (
          <AssetFlatList accounts={accountsIds} />
        )}
      </Box>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  tabsBlock: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },
  tabHeader: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: '#D9DFE5',
    borderTopColor: '#D9DFE5',
  },
  headerFocused: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  noActivityMessageBlock: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 14,
    marginHorizontal: 20,
    marginTop: 15,
    lineHeight: 20,
  },
})

export default ContentBlock

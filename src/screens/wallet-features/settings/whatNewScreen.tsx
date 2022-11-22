import React from 'react'
import { MainStackParamList } from '../../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Box, Text, TouchableOpacity } from '../../../theme'
import DeviceInfo from 'react-native-device-info'
import { scale } from 'react-native-size-matters'
import { useHeaderHeight } from '@react-navigation/elements'
import { issuesFixed, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../utils'
import { StyleSheet } from 'react-native'
import { AppIcons } from '../../../assets'
import { TabView } from 'react-native-tab-view'

const { ActiveClap, Clap } = AppIcons

type Props = NativeStackScreenProps<MainStackParamList, 'WhatNewScreen'>

const IssuesFixed = () => {
  const [showActiveClap, setShowActiveClap] = React.useState(false)

  const onClapPress = () => {
    setShowActiveClap(true)
    setTimeout(() => {
      setShowActiveClap(false)
    }, 2000)
  }

  return (
    <>
      <Text
        variant={'h2'}
        tx="issues"
        color={'darkGrey'}
        style={styles.headingHeight}
      />
      <Text
        variant={'h2'}
        tx="fixed"
        color={'darkGrey'}
        style={styles.headingHeight}
      />
      <Box marginTop={'s'}>
        {issuesFixed.map((item, index) => (
          <Box flexDirection={'row'} key={`${index}`}>
            <Text marginTop={'m'} fontSize={scale(3)} color="darkGrey">
              {'\u2B24'}
            </Text>
            <Text
              variant={'seedPhraseLabel'}
              marginTop="s"
              marginLeft={'m'}
              fontWeight="400"
              color={'darkGrey'}>
              {item}
            </Text>
          </Box>
        ))}
      </Box>
      <Box marginTop={'l'} flexDirection="row" alignItems={'center'}>
        <TouchableOpacity onPress={onClapPress}>
          {showActiveClap ? (
            <ActiveClap width={scale(34)} height={scale(34)} />
          ) : (
            <Clap width={scale(34)} height={scale(34)} />
          )}
        </TouchableOpacity>
        <Text
          variant={'h6'}
          fontWeight="500"
          color="darkGrey"
          marginLeft={'m'}
          lineHeight={scale(30)}>
          234
        </Text>
      </Box>
    </>
  )
}

const LedgerIntegration = () => {
  const [showActiveClap, setShowActiveClap] = React.useState(false)

  const onClapPress = () => {
    setShowActiveClap(true)
    setTimeout(() => {
      setShowActiveClap(false)
    }, 2000)
  }

  return (
    <>
      <Text
        variant={'h2'}
        tx="ledger"
        color={'darkGrey'}
        style={styles.headingHeight}
      />
      <Text
        variant={'h2'}
        tx="integration"
        color={'darkGrey'}
        style={styles.headingHeight}
      />
      <Box marginTop={'l'}>
        <Text
          variant={'seedPhraseLabel'}
          marginTop="s"
          fontWeight="400"
          tx="ledgerDescription"
          color={'darkGrey'}
          lineHeight={scale(21)}
        />
      </Box>
      <Text
        variant={'timelineHeader'}
        tx="didYouKnow"
        marginTop={'xl'}
        color={'darkGrey'}
        fontWeight="600"
        style={styles.headingHeight}
      />
      <Text
        variant={'seedPhraseLabel'}
        fontWeight="400"
        tx="ledgerDescription"
        color={'darkGrey'}
        lineHeight={scale(21)}
      />
      <Box marginTop={'l'} flexDirection="row" alignItems={'center'}>
        <TouchableOpacity onPress={onClapPress}>
          {showActiveClap ? (
            <ActiveClap width={scale(34)} height={scale(34)} />
          ) : (
            <Clap width={scale(34)} height={scale(34)} />
          )}
        </TouchableOpacity>
        <Text
          variant={'h6'}
          fontWeight="500"
          color="darkGrey"
          marginLeft={'m'}
          lineHeight={scale(30)}>
          234
        </Text>
      </Box>
    </>
  )
}

const WhatNewScreen: React.FC<Props> = () => {
  const version = DeviceInfo.getVersion()
  const headerHeight = useHeaderHeight()
  const [index, setIndex] = React.useState(0)
  const routes = [
    { key: 'ledger', title: 'Ledger' },
    { key: 'issues', title: 'Issues' },
  ]

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingHorizontal={'drawerPadding'}>
      <Box marginTop={'l'}>
        <Box
          backgroundColor={'yellow'}
          flexDirection="row"
          justifyContent={'flex-start'}
          paddingHorizontal="s"
          paddingVertical={'s'}
          alignSelf="flex-start">
          <Text
            variant={'addressLabel'}
            tx="whatsNewVersion"
            color={'darkGrey'}
          />
          <Box
            alignSelf={'flex-start'}
            width={1}
            marginHorizontal="l"
            height={scale(15)}
            backgroundColor="inactiveText"
          />
          <Text variant={'addressLabel'} color={'darkGrey'}>
            V {version}
          </Text>
        </Box>
      </Box>
      <Box height={(SCREEN_HEIGHT - headerHeight) * 0.8} marginTop="mxxl">
        <TabView
          key={10}
          renderTabBar={() => null}
          navigationState={{ index, routes }}
          renderScene={({ route }) => {
            switch (route.key) {
              case routes[0].key:
                return <LedgerIntegration />
              case routes[1].key:
                return <IssuesFixed />
            }
          }}
          swipeEnabled
          onIndexChange={setIndex}
          initialLayout={{ width: SCREEN_WIDTH - scale(30) }} //approx to horizontal patting
        />
      </Box>
      <Box
        // marginVertical={'mxxl'}
        flexDirection="row"
        alignItems={'center'}
        justifyContent={'space-evenly'}>
        {routes.map((item, i) => (
          <Box
            key={item.key}
            flex={0.48}
            height={scale(2)}
            backgroundColor={index === i ? 'link' : 'mediumGrey'}
          />
        ))}
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  headingHeight: {
    height: scale(39),
  },
})

export default WhatNewScreen

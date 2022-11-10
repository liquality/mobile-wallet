import { StyleSheet } from 'react-native'
import React from 'react'
import { Box, ColorType, Text, TouchableOpacity } from '../theme'
import { scale, ScaledSheet } from 'react-native-size-matters'
import {
  swapProviderTiles,
  SCREEN_WIDTH,
  SwapProviderRowProp,
  SCREEN_HEIGHT,
} from '../utils'
import { TabView } from 'react-native-tab-view'

const Aggregators = ({
  onPress,
  selectedItem,
  item,
}: {
  onPress: () => void
  selectedItem: SwapProviderRowProp
  item: SwapProviderRowProp
}) => {
  const borderLeftColorStatus = selectedItem.name === item.name
  const backgroundColor = selectedItem.name === item.name
  return (
    <TouchableOpacity onPress={onPress} key={item.name}>
      <Box
        paddingLeft={'m'}
        width={SCREEN_WIDTH / 4.55}
        marginBottom="l"
        height={SCREEN_WIDTH / 4.3}
        borderLeftColor={
          borderLeftColorStatus ? 'selectedBackgroundColor' : 'whiteLightGrey'
        }
        backgroundColor={
          backgroundColor ? 'selectedBackgroundColor' : 'transparent'
        }
        borderLeftWidth={StyleSheet.hairlineWidth}
        justifyContent="space-evenly">
        <item.icon width={scale(25)} height={scale(25)} />
        <Text variant={'h10'} color="black2" fontWeight={'400'} marginTop={'l'}>
          {item.name}
        </Text>
      </Box>
    </TouchableOpacity>
  )
}

const TabContent = ({
  selectedItem,
}: {
  selectedItem: SwapProviderRowProp
}) => {
  return (
    <Box>
      <Text
        variant={'warnText'}
        lineHeight={scale(30)}
        color="darkGrey"
        fontWeight={'400'}
        marginTop={'l'}>
        {selectedItem.heading}
      </Text>
      <Text
        variant={'h6'}
        lineHeight={scale(20)}
        color="darkGrey"
        marginTop={'s'}>
        {selectedItem.description}
      </Text>
      <Box
        flexDirection={'row'}
        marginTop="xl"
        justifyContent={'space-between'}>
        {selectedItem.pros.length ? (
          <ProsOrConsComponent
            titleColor="fastColor"
            title="PROS"
            list={selectedItem.pros}
          />
        ) : null}
        {selectedItem.cons.length ? (
          <ProsOrConsComponent
            titleColor="consColor"
            title="CONS"
            list={selectedItem.cons}
          />
        ) : null}
      </Box>
      <Box marginTop={'xl'}>
        <Text
          variant={'listText'}
          tx="feeStructure"
          color={'darkGrey'}
          fontWeight="400"
        />
        <Box marginTop={'s'}>
          {selectedItem.feeStructure.map((item, index) => (
            <Box flexDirection={'row'} key={`${index}`}>
              <Text marginTop={'m'} fontSize={scale(3)} color="darkGrey">
                {'\u2B24'}
              </Text>
              <Text
                variant={'listText'}
                marginTop="s"
                marginLeft={'m'}
                fontWeight="400"
                color={'darkGrey'}>
                {item}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

const TabTileContent = ({
  tiles,
  selectedItem,
  onPress,
}: {
  tiles: Array<SwapProviderRowProp>
  onPress: (renderItemIndex: number) => void
  selectedItem: SwapProviderRowProp
}) => {
  return (
    <Box flexWrap={'wrap'} flexDirection="row">
      {tiles.map((item, renderItemIndex) => (
        <Aggregators
          selectedItem={selectedItem}
          item={item}
          onPress={() => onPress(renderItemIndex)}
          key={item.name}
        />
      ))}
    </Box>
  )
}

const ProsOrConsComponent = ({
  title,
  list,
  titleColor,
}: {
  title: string
  list: Array<string>
  titleColor: keyof ColorType
}) => {
  return (
    <Box
      width={'49%'}
      backgroundColor="greyBackground"
      paddingHorizontal={'l'}
      paddingVertical="xl">
      <Text color={titleColor} variant="gasIndicatorLabel" marginLeft={'m'}>
        {title}
      </Text>
      <Box marginTop={'s'}>
        {list.map((item, index) => (
          <Box flexDirection={'row'} key={`${index}`}>
            <Text marginTop={'m'} fontSize={scale(3)} color="darkGrey">
              {'\u2B24'}
            </Text>
            <Text
              variant={'listText'}
              marginTop="s"
              marginLeft={'m'}
              fontWeight="400"
              color={'darkGrey'}>
              {item}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

type Props = {
  headerHeight: number
  isScrolledUp: boolean
}

const SwapProviderInfoComponent: React.FC<Props> = ({
  headerHeight,
  isScrolledUp,
}) => {
  const [selectedItem, setSelectedItem] = React.useState<SwapProviderRowProp>(
    swapProviderTiles[0],
  )
  const [index, setIndex] = React.useState(0)
  const routes = swapProviderTiles.map((item) => ({
    key: item.name,
    title: item.name,
  }))

  const onIndexChange = (itemNum: number) => {
    setSelectedItem(swapProviderTiles[itemNum])
    setIndex(itemNum)
  }

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingTop={'xl'}
      paddingHorizontal={'screenPadding'}>
      {!isScrolledUp ? (
        <Box>
          <Text
            marginTop={'s'}
            variant={'onScreenHeader'}
            color="darkGrey"
            lineHeight={scale(38)}
            fontWeight="400"
            tx="learnAboutSwapProviders"
          />
          <Text variant={'termsBody'} color="black2" tx="thereAreTradeoff" />
          <Box marginTop={'xl'}>
            <Box>
              <Text
                tx="aggregators"
                variant={'h5'}
                fontWeight="400"
                color="activeButton"
              />
              <Box
                marginTop={'s'}
                backgroundColor={'activeButton'}
                width={scale(15)}
                height={scale(2)}
              />
            </Box>
            <Box marginTop={'xl'}>
              <TabTileContent
                selectedItem={selectedItem}
                onPress={onIndexChange}
                tiles={swapProviderTiles}
              />
            </Box>
          </Box>
          <Box
            height={1}
            backgroundColor="whiteLightGrey"
            style={styles.columnWrapperStyle}
          />
        </Box>
      ) : null}
      <Box height={SCREEN_HEIGHT - headerHeight - scale(20)}>
        <Box
          flexDirection={'row'}
          alignItems="center"
          height={scale(40)}
          justifyContent={'space-between'}>
          <selectedItem.icon width={scale(40)} height={scale(40)} />
          <Box flexDirection={'row'} alignItems="center">
            {swapProviderTiles.map((item) => (
              <Box
                marginTop={'m'}
                backgroundColor={
                  item.name === selectedItem.name
                    ? 'activeButton'
                    : 'mediumGrey'
                }
                width={scale(10)}
                height={scale(2)}
                marginLeft="s"
                key={item.name}
              />
            ))}
          </Box>
        </Box>
        <TabView
          renderTabBar={() => null}
          navigationState={{ index, routes }}
          renderScene={({ route }) => {
            switch (route.key) {
              case routes[0].key:
                return <TabContent selectedItem={swapProviderTiles[0]} />
              case routes[1].key:
                return <TabContent selectedItem={swapProviderTiles[1]} />
              case routes[2].key:
                return <TabContent selectedItem={swapProviderTiles[2]} />
              case routes[3].key:
                return <TabContent selectedItem={swapProviderTiles[3]} />
              case routes[4].key:
                return <TabContent selectedItem={swapProviderTiles[4]} />
              case routes[5].key:
                return <TabContent selectedItem={swapProviderTiles[5]} />
              case routes[6].key:
                return <TabContent selectedItem={swapProviderTiles[6]} />
            }
          }}
          swipeEnabled
          onIndexChange={onIndexChange}
          initialLayout={{ width: SCREEN_WIDTH - scale(30) }} //approx to horizontal patting
        />
      </Box>
    </Box>
  )
}

const styles = ScaledSheet.create({
  columnWrapperStyle: {
    marginBottom: '20@s',
  },
})

export default SwapProviderInfoComponent

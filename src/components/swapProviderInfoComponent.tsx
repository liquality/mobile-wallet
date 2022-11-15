import { StyleSheet } from 'react-native'
import React from 'react'
import {
  Box,
  ColorType,
  OVERVIEW_TAB_BAR_STYLE,
  OVERVIEW_TAB_STYLE,
  Text,
  TabBar,
  TouchableOpacity,
} from '../theme'
import { scale, ScaledSheet } from 'react-native-size-matters'
import {
  swapProviderTiles,
  SCREEN_WIDTH,
  SwapProviderRowProp,
  SCREEN_HEIGHT,
  labelTranslateFn,
  bridgesTile,
} from '../utils'
import {
  TabView,
  SceneRendererProps,
  NavigationState,
  Route,
} from 'react-native-tab-view'
import { useRecoilValue } from 'recoil'
import { langSelected as LS } from '../atoms'
import I18n from 'i18n-js'

type RenderTabBar = SceneRendererProps & {
  navigationState: NavigationState<Route>
}

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
        variant={'h7'}
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
  const langSelected = useRecoilValue(LS)
  I18n.locale = langSelected

  const [tabTileIndex, setTabTileIndex] = React.useState(0)
  const [tabTileRoutes, setTabTileRoutes] = React.useState([
    { key: 'aggregators', title: labelTranslateFn('aggregators')! },
    { key: 'bridges', title: labelTranslateFn('bridges')! },
  ])

  React.useEffect(() => {
    setTabTileRoutes([
      { key: 'aggregators', title: labelTranslateFn('aggregators')! },
      { key: 'bridges', title: labelTranslateFn('bridges')! },
    ])
  }, [langSelected])

  const [index, setIndex] = React.useState(0)

  const swapRoutes = swapProviderTiles.map((item) => ({
    key: item.name,
    title: item.name,
  }))

  const bridgeRoutes = bridgesTile.map((item) => ({
    key: item.name,
    title: item.name,
  }))

  const onIndexChange = (itemNum: number) => {
    setSelectedItem(swapProviderTiles[itemNum])
    setIndex(itemNum)
  }

  const onSecondIndexChange = (itemNum: number) => {
    setSelectedItem(bridgesTile[itemNum])
    setIndex(itemNum)
  }

  const onTabTileIndexChange = (itemNum: number) => {
    setSelectedItem(itemNum ? bridgesTile[0] : swapProviderTiles[0])
    setTabTileIndex(itemNum)
    setIndex(0)
  }

  const renderTabBar = (props: RenderTabBar) => (
    // Redline because of theme issue with TabBar props
    <Box>
      <TabBar
        {...props}
        renderLabel={({ route, focused }) => (
          <Text
            variant={'h5'}
            fontWeight="400"
            color={focused ? 'tablabelActiveColor' : 'tablabelInactiveColor'}>
            {route.title}
          </Text>
        )}
        tabStyle={{ ...OVERVIEW_TAB_BAR_STYLE, width: scale(100) }}
        variant="light"
        style={OVERVIEW_TAB_STYLE}
      />
    </Box>
  )

  const renderDashedArray = tabTileIndex === 0 ? swapProviderTiles : bridgesTile

  const calculateHeight = tabTileIndex ? 3 : 2

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
          <Box marginTop={'l'} height={(SCREEN_WIDTH / calculateHeight) * 1.5}>
            <TabView
              renderTabBar={renderTabBar}
              navigationState={{ index: tabTileIndex, routes: tabTileRoutes }}
              renderScene={({ route }) => {
                switch (route.key) {
                  case 'aggregators':
                    return (
                      <TabTileContent
                        selectedItem={selectedItem}
                        onPress={onIndexChange}
                        tiles={swapProviderTiles}
                      />
                    )
                  case 'bridges':
                    return (
                      <TabTileContent
                        selectedItem={selectedItem}
                        onPress={onSecondIndexChange}
                        tiles={bridgesTile}
                      />
                    )
                }
              }}
              onIndexChange={onTabTileIndexChange}
              initialLayout={{ width: SCREEN_WIDTH - scale(30) }} //approx to horizontal patting
              sceneContainerStyle={{
                marginTop: scale(15),
              }}
              swipeEnabled
            />
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
            {renderDashedArray.map((item) => (
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
        {tabTileIndex ? (
          <TabView
            key={1}
            renderTabBar={() => null}
            navigationState={{ index, routes: bridgeRoutes }}
            renderScene={({ route }) => {
              switch (route.key) {
                case bridgeRoutes[0].key:
                  return <TabContent selectedItem={bridgesTile[0]} />
                case bridgeRoutes[1].key:
                  return <TabContent selectedItem={bridgesTile[1]} />
                case bridgeRoutes[2].key:
                  return <TabContent selectedItem={bridgesTile[2]} />
              }
            }}
            swipeEnabled
            onIndexChange={onSecondIndexChange}
            initialLayout={{ width: SCREEN_WIDTH - scale(30) }} //approx to horizontal patting
          />
        ) : (
          <TabView
            key={2}
            renderTabBar={() => null}
            navigationState={{ index, routes: swapRoutes }}
            renderScene={({ route }) => {
              switch (route.key) {
                case swapRoutes[0].key:
                  return <TabContent selectedItem={swapProviderTiles[0]} />
                case swapRoutes[1].key:
                  return <TabContent selectedItem={swapProviderTiles[1]} />
                case swapRoutes[2].key:
                  return <TabContent selectedItem={swapProviderTiles[2]} />
                case swapRoutes[3].key:
                  return <TabContent selectedItem={swapProviderTiles[3]} />
                case swapRoutes[4].key:
                  return <TabContent selectedItem={swapProviderTiles[4]} />
                case swapRoutes[5].key:
                  return <TabContent selectedItem={swapProviderTiles[5]} />
                case swapRoutes[6].key:
                  return <TabContent selectedItem={swapProviderTiles[6]} />
              }
            }}
            swipeEnabled
            onIndexChange={onIndexChange}
            initialLayout={{ width: SCREEN_WIDTH - scale(30) }} //approx to horizontal patting
          />
        )}
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

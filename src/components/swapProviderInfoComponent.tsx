import { StyleSheet } from 'react-native'
import React from 'react'
import { Box, ColorType, Text, TouchableOpacity } from '../theme'
import { AppIcons } from '../assets'
import { useNavigation, NavigationProp } from '@react-navigation/core'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { MainStackParamList } from '../types'
import { assetRowTiles, SCREEN_WIDTH, AssetRowProp } from '../utils'

const { BuyCryptoCloseLight } = AppIcons

const Aggregators = ({
  onPress,
  selectedItem,
  item,
}: {
  onPress: (item: AssetRowProp) => void
  selectedItem: AssetRowProp
  item: AssetRowProp
}) => {
  const borderLeftColorStatus = selectedItem.name === item.name
  const backgroundColor = selectedItem.name === item.name
  return (
    <TouchableOpacity onPress={() => onPress(item)} key={item.name}>
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
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()
  const [selectedItem, setSelectedItem] = React.useState<AssetRowProp>(
    assetRowTiles[0],
  )

  const onPress = (item: AssetRowProp) => {
    setSelectedItem(item)
  }

  const renderItem = ({ item }: { item: AssetRowProp }) => {
    return (
      <Aggregators
        selectedItem={selectedItem}
        item={item}
        onPress={onPress}
        key={item.name}
      />
    )
  }

  return (
    <>
      {!isScrolledUp ? (
        <Box
          marginTop={'xl'}
          alignItems="flex-end"
          paddingBottom={'l'}
          paddingHorizontal={'screenPadding'}>
          <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
            <BuyCryptoCloseLight />
          </TouchableOpacity>
        </Box>
      ) : null}
      <Box
        flex={1}
        backgroundColor="mainBackground"
        style={{ paddingTop: isScrolledUp ? scale(10) : headerHeight / 2 }}
        paddingHorizontal={'screenPadding'}>
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
          <Box marginTop={'m'}>
            <Box flexWrap={'wrap'} flexDirection="row">
              {assetRowTiles.map((item) => renderItem({ item }))}
            </Box>
          </Box>
        </Box>
        <Box
          height={1}
          backgroundColor="whiteLightGrey"
          style={styles.columnWrapperStyle}
        />
        <Box
          flexDirection={'row'}
          alignItems="center"
          height={scale(40)}
          justifyContent={'space-between'}>
          <selectedItem.icon width={scale(40)} height={scale(40)} />
          <Box flexDirection={'row'} alignItems="center">
            {assetRowTiles.map((item) => (
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
    </>
  )
}

const styles = ScaledSheet.create({
  columnWrapperStyle: {
    marginBottom: '20@s',
  },
})

export default SwapProviderInfoComponent

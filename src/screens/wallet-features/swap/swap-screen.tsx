import React, { FC } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import {
  Box,
  Text,
  Pressable,
  faceliftPalette,
  TextInput,
  ColorType,
  ScrollView,
  FLEX_1,
} from '../../../theme'
import { AppIcons } from '../../../assets'
import { scale } from 'react-native-size-matters'

const {
  PwEthNewIcon,
  MaticNewIcon,
  WavyArrow,
  ChevronRightIcon,
  ThinDownArrowActive,
  ThinDoubleArrowActive,
  NetworkSpeedEdit,
  DoubleArrowThick,
} = AppIcons

type SwapScreenProps = NativeStackScreenProps<MainStackParamList, 'SwapScreen'>

enum InputFocus {
  TO,
  FROM,
  NULL,
}

enum MinOrMax {
  MIN,
  MAX,
  NULL,
}

const SwapScreen: FC<SwapScreenProps> = (props) => {
  const { navigation } = props
  const [focusType, setFocusType] = React.useState(InputFocus.NULL)
  const [minOrMax, setMinOrMax] = React.useState(MinOrMax.NULL)

  const fromFocused = () => {
    setFocusType(InputFocus.FROM)
  }

  const onBlur = () => {
    setFocusType(InputFocus.NULL)
  }

  const onMinOrMaxFnPress = (selected: MinOrMax) => {
    setMinOrMax(selected)
    setTimeout(() => {
      setMinOrMax(MinOrMax.NULL)
    }, 2000)
  }

  const fromBackgroundColor: keyof ColorType =
    focusType === InputFocus.FROM ? 'lightInputActiveColor' : 'mediumWhite'

  const isMinActive = MinOrMax.MIN === minOrMax
  const isMaxActive = MinOrMax.MAX === minOrMax

  return (
    <Box flex={1} backgroundColor="mainBackground" paddingHorizontal={'xl'}>
      <Box flex={1}>
        <Box flex={0.75}>
          <ScrollView style={FLEX_1}>
            <Box height={scale(355)} width="100%">
              <Box
                height={scale(175)}
                width={'100%'}
                backgroundColor={fromBackgroundColor}
                padding={'xl'}>
                <Box flexDirection={'row'} marginTop="m">
                  <Text variant={'subListBoldText'} color="darkGrey">
                    PWETH
                  </Text>
                  <Text marginLeft={'s'} variant="subListText" color="darkGrey">
                    0.01793 Balance
                  </Text>
                </Box>
                <Box
                  flexDirection={'row'}
                  marginTop={'s'}
                  justifyContent="space-between"
                  height={scale(36)}
                  width={'100%'}>
                  <Box flex={0.8}>
                    <TextInput
                      cursorColor={faceliftPalette.buttonDefault}
                      variant={'swapInput'}
                      placeholder="0.00"
                      onFocus={fromFocused}
                      onBlur={onBlur}
                      maxLength={15}
                    />
                  </Box>
                  <TouchableWithoutFeedback>
                    <Box
                      flex={0.2}
                      justifyContent="space-between"
                      flexDirection="row"
                      alignItems={'center'}>
                      <PwEthNewIcon />
                      <ChevronRightIcon width={scale(15)} height={scale(15)} />
                    </Box>
                  </TouchableWithoutFeedback>
                </Box>
                <Box flexDirection={'row'} alignItems="center">
                  <WavyArrow />
                  <Text
                    variant={'h7'}
                    color="darkGrey"
                    lineHeight={scale(30)}
                    paddingTop="s">
                    $109.59
                  </Text>
                </Box>
                <Box flexDirection={'row'} alignItems="center" marginTop={'m'}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onMinOrMaxFnPress(MinOrMax.MIN)}>
                    <Box
                      borderBottomColor={
                        isMinActive ? 'defaultButton' : 'transparent'
                      }
                      borderBottomWidth={1}>
                      <Text
                        variant={'transLink'}
                        color={isMinActive ? 'defaultButton' : 'greyMeta'}
                        tx="common.min"
                      />
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onMinOrMaxFnPress(MinOrMax.MAX)}>
                    <Box
                      borderBottomColor={
                        isMaxActive ? 'defaultButton' : 'transparent'
                      }
                      borderBottomWidth={1}
                      marginLeft="l">
                      <Text
                        variant={'transLink'}
                        color={isMaxActive ? 'defaultButton' : 'greyMeta'}
                        tx="common.max"
                      />
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Box>
              <Box height={scale(5)} width={'100%'} />
              <Box
                height={scale(175)}
                width={'100%'}
                backgroundColor={'mediumWhite'}
                padding={'xl'}>
                <Box flexDirection={'row'} marginTop="m">
                  <Text variant={'subListBoldText'} color="darkGrey">
                    MATIC
                  </Text>
                </Box>
                <Box
                  flexDirection={'row'}
                  marginTop={'s'}
                  justifyContent="space-between"
                  height={scale(36)}
                  width={'100%'}>
                  <Box flex={0.8}>
                    <TextInput
                      cursorColor={faceliftPalette.buttonDefault}
                      variant={'swapInput'}
                      placeholder="0.00"
                      editable={false}
                      onFocus={fromFocused}
                      onBlur={onBlur}
                      maxLength={15}
                    />
                  </Box>
                  <TouchableWithoutFeedback>
                    <Box
                      flex={0.2}
                      justifyContent="space-between"
                      flexDirection="row"
                      alignItems={'center'}>
                      <MaticNewIcon />
                      <ChevronRightIcon width={scale(15)} height={scale(15)} />
                    </Box>
                  </TouchableWithoutFeedback>
                </Box>
                <Box flexDirection={'row'} alignItems="center">
                  <WavyArrow />
                  <Text
                    variant={'h7'}
                    color="darkGrey"
                    lineHeight={scale(30)}
                    paddingTop="s">
                    $109.59
                  </Text>
                </Box>
              </Box>
              <Box position={'absolute'} height="100%" right={0} zIndex={0}>
                <Box
                  position={'relative'}
                  flex={1}
                  justifyContent="center"
                  alignItems={'flex-end'}>
                  <Box style={styles.arrowLeft} />
                  <Box position={'absolute'} right={-scale(5)}>
                    <ThinDownArrowActive />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              flexDirection={'row'}
              marginTop="m"
              alignItems="center"
              justifyContent={'center'}>
              <Text
                lineHeight={scale(30)}
                marginRight="s"
                color={'darkGrey'}
                variant={'addressLabel'}>
                1 PWETH = 1943.321946 MATIC
              </Text>
              <ThinDoubleArrowActive />
            </Box>
            <Text
              textAlign={'center'}
              color={'defaultButton'}
              variant={'addressLabel'}>
              [n] Quotes
            </Text>
            <Box
              flexDirection={'row'}
              marginTop="xxl"
              alignItems="center"
              justifyContent={'center'}>
              <Text
                lineHeight={scale(30)}
                marginRight="s"
                color={'defaultButton'}
                variant={'addressLabel'}
                tx="common.networkSpeed"
              />
              <NetworkSpeedEdit />
            </Box>
          </ScrollView>
        </Box>
        <Box flex={0.25}>
          <Box marginVertical={'xl'}>
            <Pressable
              label={{ tx: 'common.next' }}
              onPress={() => {}}
              variant="solid"
              customView={
                <Box
                  flexDirection={'row'}
                  alignItems="center"
                  justifyContent={'center'}>
                  <DoubleArrowThick />
                  <Text
                    marginLeft="m"
                    color={'white'}
                    variant={'h6'}
                    lineHeight={scale(30)}
                    tx="common.review"
                  />
                </Box>
              }
            />
          </Box>
          <Text
            onPress={navigation.goBack}
            textAlign={'center'}
            variant="link"
            tx="termsScreen.cancel"
          />
        </Box>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  arrowLeft: {
    borderTopWidth: scale(40),
    borderRightWidth: scale(40),
    borderBottomWidth: scale(40),
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: faceliftPalette.lightBackground,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
})

export default SwapScreen

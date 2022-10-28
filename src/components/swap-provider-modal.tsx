import React, { useState } from 'react'
import { FlatList } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../types'
import { Box, Text, Pressable } from '../theme'
import { scale } from 'react-native-size-matters'
import { useRecoilState, useRecoilValue } from 'recoil'
import { swapQuotesState, swapQuoteState } from '../atoms'
import { SwapQuote } from '@liquality/wallet-core/dist/src/swaps/types'
import AssetIcon from './asset-icon'
import { dpUI } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { calculateQuoteRate } from '@liquality/wallet-core/dist/src/utils/quotes'

type Props = NativeStackScreenProps<MainStackParamList, 'SwapProviderModal'>
const SwapProviderModal = (props: Props) => {
  const { navigation } = props
  const quotes = useRecoilValue(swapQuotesState)
  const [selectedQuote, setSelectedQuote] = useRecoilState(swapQuoteState)
  const [localQuote, setLocalQuote] = useState(selectedQuote)

  const onSwapProviderPress = (item: SwapQuote) => {
    setLocalQuote(item)
  }

  const onApplyPress = () => {
    if (selectedQuote?.provider !== localQuote?.provider) {
      setSelectedQuote(localQuote)
    }
    navigation.goBack()
  }

  const renderItem = ({ item, index }: { item: SwapQuote; index: number }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSwapProviderPress(item)}>
        <Box
          flexDirection="row"
          backgroundColor={
            item.provider === localQuote?.provider
              ? 'selectedBackgroundColor'
              : 'blockBackgroundColor'
          }
          alignItems="center"
          marginTop={'s'}
          height={scale(78)}>
          <Box flex={0.5} marginLeft="xl">
            <Text variant={'rateLabel'} color="darkGrey" numberOfLines={1}>
              {dpUI(calculateQuoteRate(selectedQuote!), 5).toString()}{' '}
            </Text>
          </Box>
          <Box
            marginLeft={'s'}
            flex={0.5}
            flexDirection="row"
            alignItems={'center'}>
            <AssetIcon asset={item.provider} />
            <Text marginLeft={'m'} variant={'rateLabel'} color="darkGrey">
              {item.provider}
            </Text>
          </Box>
          {index === 0 ? (
            <Box
              position={'absolute'}
              left={scale(20)}
              top={0}
              backgroundColor="yellow">
              <Text
                paddingHorizontal={'s'}
                variant="networkStatus"
                color={'secondaryForeground'}
                tx="bestRate"
              />
            </Box>
          ) : null}
        </Box>
      </TouchableOpacity>
    )
  }

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingHorizontal={'screenPadding'}>
      <Box flex={0.8}>
        <Box flexDirection="row" marginTop={'xxl'} marginBottom="xl">
          <Box flex={0.5} marginLeft="xl">
            <Text
              variant={'addressLabel'}
              tx="listHeaderComp.rate"
              color={'darkGrey'}
            />
          </Box>
          <Box flex={0.5}>
            <Text
              variant={'addressLabel'}
              tx="listHeaderComp.provider"
              color={'darkGrey'}
            />
          </Box>
        </Box>
        <FlatList
          data={quotes}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${index}`}
        />
      </Box>
      <Box flex={0.2}>
        <Box marginVertical={'xl'}>
          <Pressable
            label={{ tx: 'common.apply' }}
            onPress={onApplyPress}
            variant="solid"
          />
        </Box>
      </Box>
    </Box>
  )
}

export default SwapProviderModal

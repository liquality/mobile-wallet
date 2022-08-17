import React from 'react'
import { StyleSheet, ScrollView, Pressable, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  chains,
  unitToCurrency,
  assets as cryptoassets,
} from '@liquality/cryptoassets'
import { SendHistoryItem } from '@liquality/wallet-core/dist/src/store/types'
import { RootStackParamList } from '../../../types'
import SendTransactionDetails from '../../../components/send/send-transaction-details'
import ProgressCircle from '../../../components/animations/progress-circle'
import SuccessIcon from '../../../assets/icons/activity-status/completed.svg'
import Text from '../../../theme/text'
import Box from '../../../theme/box'
import { formatDate } from '../../../utils'
import { useRecoilValue } from 'recoil'
import { historyStateFamily } from '../../../atoms'

type SendConfirmationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SendConfirmationScreen'
>

const ConfirmationComponent: React.FC<SendConfirmationScreenProps> = React.memo(
  (props) => {
    const { navigation, route } = props
    const transaction = route.params.sendTransactionConfirmation!
    const historyItem = useRecoilValue(
      historyStateFamily(transaction.id),
    ) as SendHistoryItem

    const handleTransactionSpeedUp = () => {
      navigation.navigate('CustomFeeScreen', {
        assetData: route.params.assetData,
        screenTitle: 'NETWORK SPEED/FEE',
      })
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          paddingHorizontal="xl"
          marginBottom="xl">
          <Box>
            <Text variant="header" tx="sendConfirmationScreeen.status" />
            <Text variant="content">
              {historyItem.status === 'SUCCESS'
                ? `Completed / ${
                    chains[cryptoassets[historyItem.from].chain]
                      .safeConfirmations
                  } confirmations`
                : `Pending / ${
                    chains[cryptoassets[historyItem.from].chain]
                      .safeConfirmations - (historyItem.tx.confirmations || 0)
                  } confirmations`}
            </Text>
          </Box>
          {historyItem.status === 'SUCCESS' ? (
            <SuccessIcon />
          ) : (
            <ProgressCircle
              radius={17}
              current={historyItem.tx.confirmations || 0}
              total={
                chains[cryptoassets[historyItem.from].chain].safeConfirmations
              }
            />
          )}
        </Box>
        <Box
          justifyContent="space-between"
          paddingHorizontal="xl"
          marginBottom="xl">
          <Text variant="header" tx="sendConfirmationScreeen.time" />
          <Text variant="content">{formatDate(historyItem.startTime)}</Text>
        </Box>
        <Box
          justifyContent="space-between"
          paddingHorizontal="xl"
          marginBottom="xl">
          <Text variant="header" tx="sendConfirmationScreeen.sent" />
          <Text variant="content">
            {historyItem.fee &&
              `${unitToCurrency(
                cryptoassets[historyItem.from],
                historyItem.tx.value,
              ).toNumber()} ${historyItem.from}`}
          </Text>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          paddingHorizontal="xl"
          minHeight={60}
          paddingVertical="m"
          borderTopWidth={1}
          borderBottomWidth={1}
          borderColor="mainBorderColor">
          <Box>
            <Text variant="header" tx="sendConfirmationScreeen.networkSpeed" />
            <Text variant="content">
              {`${historyItem.from} Fee: ${historyItem.fee} x ${
                chains[cryptoassets[historyItem.from].chain].fees.unit
              }`}
            </Text>
          </Box>
          {historyItem.status !== 'SUCCESS' && (
            <Pressable onPress={handleTransactionSpeedUp}>
              <Text variant="link" tx="sendConfirmationScreeen.speedUp" />
            </Pressable>
          )}
        </Box>
        {historyItem && <SendTransactionDetails historyItem={historyItem} />}
      </ScrollView>
    )
  },
)

const SendConfirmationScreen: React.FC<SendConfirmationScreenProps> = ({
  route,
  navigation,
}) => {
  return (
    <React.Suspense
      fallback={
        <View>
          <Text tx="sendConfirmationScreeen.load" />
        </View>
      }>
      <ConfirmationComponent navigation={navigation} route={route} />
    </React.Suspense>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
  },
})

export default SendConfirmationScreen

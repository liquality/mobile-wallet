import React, { useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'
import {
  dpUI,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { sendTransaction } from '../../../store/store'
import { assets as cryptoassets, currencyToUnit } from '@liquality/cryptoassets'
import { BigNumber } from '@liquality/types'
import Button from '../../../theme/button'
import Text from '../../../theme/text'
import { getSendFee } from '@liquality/wallet-core/dist/src/utils/fees'
import Box from '../../../theme/box'
import ButtonFooter from '../../../components/button-footer'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import {
  fiatRatesState,
  historyIdsState,
  historyStateFamily,
  networkState,
} from '../../../atoms'
import { HistoryItem } from '@liquality/wallet-core/dist/src/store/types'
import { labelTranslateFn } from '../../../utils'
import i18n from 'i18n-js'

type SendReviewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SendReviewScreen'
>

const SendReviewScreen = ({ navigation, route }: SendReviewScreenProps) => {
  const { asset, destinationAddress, gasFee, amount, memo, speedLabel, color } =
    route.params.sendTransaction!
  const [rate, setRate] = useState<number>(0)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fiatRates = useRecoilValue(fiatRatesState)
  const activeNetwork = useRecoilValue(networkState)
  const ids = useRecoilValue(historyIdsState)
  const addTransaction = useRecoilCallback(
    ({ set }) =>
      (transactionId: string, historyItem: HistoryItem) => {
        set(historyIdsState, [...ids, transactionId])
        set(historyStateFamily(transactionId), historyItem)
      },
  )

  const handleSendPress = async () => {
    setIsLoading(true)
    if (!asset || !destinationAddress || !amount || !gasFee || !activeNetwork) {
      setError(labelTranslateFn('sendReviewScreen.inputDataInvalid')!)
      return
    }

    try {
      const transaction = await sendTransaction({
        asset,
        activeNetwork,
        to: destinationAddress,
        value: new BigNumber(
          currencyToUnit(cryptoassets[asset], amount).toNumber(),
        ),
        fee: gasFee,
        feeLabel: speedLabel,
        memo: memo || '',
      })

      delete transaction.tx._raw

      addTransaction(transaction.id, transaction)

      navigation.navigate('SendConfirmationScreen', {
        screenTitle: i18n.t('sendReviewScreen.sendTransDetails', { asset }),
        sendTransactionConfirmation: transaction,
      })
    } catch (_error) {
      setIsLoading(false)
      setError(labelTranslateFn('sendReviewScreen.failedTrans')! + _error)
    }
  }

  const handleEditPress = () => {
    navigation.goBack()
  }

  useEffect(() => {
    if (!fiatRates || !asset || !fiatRates[asset]) {
      setError(labelTranslateFn('sendReviewScreen.rateNotAvail')!)
    } else {
      setRate(fiatRates[asset])
    }
  }, [fiatRates, asset])

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingVertical="l"
      paddingHorizontal="xl">
      <Box marginTop="l">
        <Text variant="secondaryInputLabel" tx="sendReviewScreen.send" />
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          marginBottom="m">
          <Text variant="amountLarge" style={{ color }}>
            {amount && `${new BigNumber(amount).dp(6)} ${asset}`}
          </Text>
          <Text variant="amount">
            {amount && `$${prettyFiatBalance(amount, rate)}`}
          </Text>
        </Box>
      </Box>

      <Box marginTop="l">
        <Text variant="secondaryInputLabel" tx="sendReviewScreen.netFee" />
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          marginBottom="m">
          <Text variant="amount">
            {asset &&
              gasFee &&
              `${dpUI(getSendFee(asset, gasFee), 9)} ${asset}`}
          </Text>
          <Text variant="amount">
            {gasFee &&
              asset &&
              `$${prettyFiatBalance(
                getSendFee(asset, gasFee).toNumber(),
                rate,
              )}`}
          </Text>
        </Box>
      </Box>

      <Box marginTop="l">
        <Text variant="secondaryInputLabel" tx="sendReviewScreen.amtFee" />
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          marginBottom="m">
          <Text variant="amount">
            {amount &&
              gasFee &&
              asset &&
              `${new BigNumber(amount)
                .plus(getSendFee(asset, gasFee))
                .dp(9)} ${asset}`}
          </Text>
          <Text variant="amount">
            {amount &&
              gasFee &&
              asset &&
              `$${prettyFiatBalance(
                new BigNumber(amount)
                  .plus(getSendFee(asset, gasFee))
                  .toNumber(),
                rate,
              )}`}
          </Text>
        </Box>
      </Box>

      <Box marginTop="l">
        <Text variant="secondaryInputLabel" tx="sendReviewScreen.sendTo" />
        <Text variant="address">{shortenAddress(destinationAddress)}</Text>
      </Box>

      <Box marginTop="l">
        <Text variant="secondaryInputLabel" tx="sendReviewScreen.memoOpt" />
        <Text variant="address">{memo}</Text>
      </Box>

      {!!error && <Text variant="error">{error}</Text>}
      <ButtonFooter>
        <Button
          type="secondary"
          variant="m"
          label={{ tx: 'sendReviewScreen.edit' }}
          onPress={handleEditPress}
          isBorderless={false}
          isActive={true}
        />
        <Button
          type="primary"
          variant="m"
          label={i18n.t('sendReviewScreen.sendAsset', { asset })}
          onPress={handleSendPress}
          isLoading={isLoading}
          isBorderless={false}
          isActive={true}
        />
      </ButtonFooter>
    </Box>
  )
}

export default SendReviewScreen

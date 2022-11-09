import React, { FC } from 'react'
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native'
import { Text, Button, palette } from '../../theme'
import { TxKeyPath, translate } from '../../i18n'
import i18n from 'i18n-js'
import { langSelected as LS } from '../../../src/atoms'
import { useRecoilValue } from 'recoil'

type MessageBannerProps = {
  text1: string | { tx: TxKeyPath }
  text2?: string | { tx: TxKeyPath }
  linkTxt?: string | { tx: TxKeyPath }
  onTextPress?: () => void
  btnLabel?: string | { tx: TxKeyPath }
  txOptions1?: i18n.TranslateOptions
  txOptions2?: i18n.TranslateOptions
  buttonStyle?: StyleProp<ViewStyle>
  onAction?: () => void
}

const textToContentConverterFn = (
  text: string | { tx: TxKeyPath },
  txOptions?: i18n.TranslateOptions,
): string => {
  let content = ''
  if (typeof text !== 'string') {
    const { tx } = text
    content = (tx && translate(tx, txOptions)) || ''
  } else {
    content = text
  }
  return content
}

const MessageBanner: FC<MessageBannerProps> = (props) => {
  const {
    txOptions1,
    txOptions2,
    text1,
    text2,
    linkTxt,
    onTextPress,
    btnLabel,
    onAction,
    buttonStyle,
  } = props
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected
  let content1 = textToContentConverterFn(text1, txOptions1)
  let content2 = textToContentConverterFn(text2 || '', txOptions2)
  let clickableTxt = textToContentConverterFn(linkTxt || '')
  let buttonText = textToContentConverterFn(btnLabel || '')

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text variant="label" paddingRight="s">
          {content1}
          {clickableTxt ? (
            <Text
              color="buttonBackgroundPrimary"
              variant="link"
              onPress={onTextPress}>
              {`${clickableTxt}`}
            </Text>
          ) : null}
          {content2 ? <Text variant="label">{` ${content2}`}</Text> : null}
        </Text>
        {buttonText && onAction ? (
          <View style={buttonStyle}>
            <Button
              type="tertiary"
              variant="s"
              label={buttonText}
              onPress={onAction}
              isBorderless={false}
              isActive={true}
            />
          </View>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.yellowBar,
    width: '100%',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
})

export default MessageBanner

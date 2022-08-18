import React, { FC } from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native'
import Button from '../../theme/button'
import Text from '../../theme/text'
import { TxKeyPath, translate } from '../../i18n'
import i18n from 'i18n-js'

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

  let content1 = textToContentConverterFn(text1, txOptions1)
  let content2 = textToContentConverterFn(text2 || '', txOptions2)
  let clickableTxt = textToContentConverterFn(linkTxt || '')
  let buttonText = textToContentConverterFn(btnLabel || '')

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.text}>
          {content1}
          {clickableTxt ? (
            <Text
              color={'buttonBackgroundPrimary'}
              style={[styles.text, styles.linkStyle]}
              onPress={onTextPress}>
              {`${clickableTxt}`}
            </Text>
          ) : null}
          {content2 ? <Text style={styles.text}>{` ${content2}`}</Text> : null}
        </Text>
        {buttonText && onAction ? (
          <View style={[styles.btnMargin, buttonStyle]}>
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
    backgroundColor: '#FFF8DA',
    width: Dimensions.get('screen').width,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
  },
  linkStyle: {
    textDecorationLine: 'underline',
  },
  btnMargin: {
    marginLeft: 15,
  },
})

export default MessageBanner

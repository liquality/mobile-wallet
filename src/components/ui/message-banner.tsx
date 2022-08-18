import React, { FC } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import Button from '../../theme/button'
import Text from '../../theme/text'
import { TxKeyPath, translate } from '../../i18n'
import i18n from 'i18n-js'

type MessageBannerProps = {
  text1: string | { tx1: TxKeyPath }
  text2: string | { tx2: TxKeyPath }
  txOptions1?: i18n.TranslateOptions
  txOptions2?: i18n.TranslateOptions
  onAction: (...args: unknown[]) => void
}

const MessageBanner: FC<MessageBannerProps> = (props) => {
  // const { tx, txOptions, text1, text2, onAction } = props
  const { txOptions1, txOptions2, text1, text2, onAction } = props

  let content1
  if (typeof text1 !== 'string') {
    const { tx1 } = text1
    content1 = tx1 && translate(tx1, txOptions1)
  } else {
    content1 = text1
  }
  let content2
  if (typeof text2 !== 'string') {
    const { tx2 } = text2
    content2 = tx2 && translate(tx2, txOptions2)
  } else {
    content2 = text2
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{content1}</Text>
      <View style={styles.row}>
        <Text style={styles.text}>{content2}</Text>
        <Button
          type="tertiary"
          variant="s"
          label={{ tx: 'common.addLiquidity' }}
          onPress={onAction}
          isBorderless={false}
          isActive={true}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8DA',
    width: Dimensions.get('screen').width,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 16,
  },
})

export default MessageBanner

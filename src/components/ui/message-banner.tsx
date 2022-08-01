import React, { FC } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import Button from '../../theme/button'
import Text from '../../theme/text'
import { TxKeyPath, translate } from '../../i18n'

type MessageBannerProps = {
  text1: string
  text2: string
  tx?: TxKeyPath
  txOptions?: i18n.TranslateOptions
  onAction: (...args: unknown[]) => void
}

const MessageBanner: FC<MessageBannerProps> = (props) => {
  const { tx, txOptions, text1, text2, onAction } = props

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text1

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{content}</Text>
      <View style={styles.row}>
        <Text style={styles.text}>{text2}</Text>
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

import React, { FC } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import Button from '../../theme/button'

type MessageBannerProps = {
  text1: string
  text2: string
  onAction: (...args: unknown[]) => void
}

const MessageBanner: FC<MessageBannerProps> = (props) => {
  const { text1, text2, onAction } = props

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text1}</Text>
      <View style={styles.row}>
        <Text style={styles.text}>{text2}</Text>
        <Button
          type="tertiary"
          variant="s"
          label="Add Liquidity"
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

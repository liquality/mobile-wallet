import { Modal, StyleSheet, View } from 'react-native'
import React from 'react'
import { Text, Button, palette } from '../../theme'
import { Fonts } from '../../assets'

const WhatsNew = ({ onAction }: { onAction: (visible: boolean) => any }) => {
  const styles = StyleSheet.create({
    modalView: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentWrapper: {
      width: '90%',
      alignItems: 'center',
      backgroundColor: palette.white,
      borderColor: palette.gray,
      borderWidth: 1,
      padding: 20,
      shadowColor: palette.black2,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    content: {
      fontFamily: Fonts.Regular,
      fontWeight: '500',
      fontSize: 14,
      color: palette.black2,
      textAlign: 'justify',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    header: {
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center',
      marginVertical: 5,
    },
  })

  const handleOkButtonPress = () => {
    onAction(false)
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      style={styles.modalView}>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text style={[styles.content, styles.header]} tx="whatsNew" />
          <Text style={styles.content} tx="whatsNewDesc" />
          <Button
            type="primary"
            variant="m"
            label={{ tx: 'common.ok' }}
            onPress={handleOkButtonPress}
            isBorderless={false}
            isActive={true}
          />
        </View>
      </View>
    </Modal>
  )
}

export default WhatsNew

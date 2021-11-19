import { Modal, StyleSheet, Text, View } from 'react-native'
import LiqualityButton from '../button'
import React from 'react'

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
      backgroundColor: '#FFF',
      borderColor: '#D9DFE5',
      borderWidth: 1,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    content: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '500',
      fontSize: 14,
      color: '#000D35',
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
          <Text style={[styles.content, styles.header]}>What's New</Text>
          <Text style={styles.content}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In euismod
            ante in augue tristique convallis. Morbi pharetra, erat quis mattis
            tristique, sapien tortor convallis diam, elementum rhoncus erat
            massa vitae nibh. Ut suscipit nisi enim, ut dictum felis tristique
            sit amet.
          </Text>
          <LiqualityButton
            text={'OK'}
            variant="medium"
            type="positive"
            action={handleOkButtonPress}
          />
        </View>
      </View>
    </Modal>
  )
}

export default WhatsNew

import {
  Modal,
  StyleSheet,
  View,
  TextStyle,
  ViewStyle,
  Pressable,
} from 'react-native'
import React from 'react'
import { Box, Button } from '../../../theme'
import { Text } from '../../../components/text/text'
import { AppIcons, Fonts } from '../../../assets'

const { XIcon } = AppIcons

type BuyCryptoModalProps = {
  onPress: () => void
  handleLinkPress: (url: string) => void
  visible: boolean
  isPoweredByTransak: boolean
  poweredTransakComp: JSX.Element
}

const FeeLimitStyle: TextStyle = {
  fontSize: 11,
}

const AlignCenter: ViewStyle = {
  alignItems: 'center',
}

const XIconStyle: ViewStyle = {
  position: 'absolute',
  top: 1,
  right: 1,
}

const Padding10: ViewStyle = {
  padding: 10,
}

const BuyCryptoModal: React.FC<BuyCryptoModalProps> = ({
  onPress,
  visible,
  isPoweredByTransak,
  poweredTransakComp,
  handleLinkPress,
}) => {
  const onContinueTransakPress = () => {
    handleLinkPress('https://transak.com/')
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      style={styles.modalView}>
      <Box style={styles.container}>
        <Box style={styles.contentWrapper}>
          <Pressable onPress={onPress} style={XIconStyle}>
            <View style={Padding10}>
              <XIcon width={25} height={25} />
            </View>
          </Pressable>
          <Text
            style={[styles.content, styles.header]}
            tx="receiveScreen.buyCrypto"
          />
          <Text
            style={styles.transakContentStyle}
            tx="receiveScreen.transakContent"
          />
          <Text
            style={[styles.transakContentStyle, FeeLimitStyle]}
            tx="receiveScreen.feeAndLimits"
          />
          {isPoweredByTransak && (
            <View style={AlignCenter}>{poweredTransakComp}</View>
          )}
          <Button
            type="primary"
            variant="l"
            label={{ tx: 'receiveScreen.continueToTransak' }}
            onPress={onContinueTransakPress}
            isBorderless={false}
            isActive={true}
          />
        </Box>
      </Box>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentWrapper: {
    width: '90%',
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
    fontFamily: Fonts.Regular,
    fontWeight: '300',
    fontSize: 14,
    color: '#000D35',
    textAlign: 'justify',
    paddingVertical: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 5,
    textTransform: 'uppercase',
  },
  transakContentStyle: {
    fontFamily: Fonts.Regular,
    fontWeight: '300',
    fontSize: 13,
    color: '#000D35',
    paddingVertical: 10,
  },
})

export default BuyCryptoModal

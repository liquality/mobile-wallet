import React from 'react'
import { Modal, TouchableWithoutFeedback } from 'react-native'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { AppIcons } from '../../../assets'
import BackgroundBlock from '../../../components/ui/BackgroundBlock'
import {
  ALIGN_ITEM_FLEX_END,
  Box,
  Pressable,
  Text,
  TouchableOpacity,
} from '../../../theme'
import { SCREEN_WIDTH } from '../../../utils'

const { BuyCryptoCloseLight } = AppIcons

type SpeedUpModalProps = {
  visible: boolean
  onClose: () => void
}

const SpeedUpModal = ({ visible, onClose }: SpeedUpModalProps) => {
  return (
    <Modal visible={visible} transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <Box
          flex={1}
          backgroundColor="semiTransparentGrey"
          justifyContent="center"
          alignItems={'center'}>
          <Box
            width={scale(SCREEN_WIDTH * 0.8)}
            height={scale(SCREEN_WIDTH * 0.85)}
            padding={'drawerPadding'}>
            <BackgroundBlock
              width={scale(SCREEN_WIDTH * 0.8)}
              height={scale(SCREEN_WIDTH * 0.85)}
            />
            <Box flex={0.8}>
              <Text
                variant={'h3'}
                lineHeight={scale(30)}
                color="black"
                tx="speedUpNoLonger"
              />
              <Text
                variant={'h7'}
                color="darkGrey"
                marginTop={'l'}
                tx="yourTranConfirmedMsg"
              />
              <Text
                variant={'h8'}
                color="darkGrey"
                marginTop={'l'}
                tx="speedUpOptionMsg"
              />
            </Box>
            <Box flex={0.2} alignSelf="flex-start" justifyContent={'center'}>
              <Pressable
                label={{ tx: 'gotIt' }}
                onPress={onClose}
                variant="solid"
                style={styles.okButton}
              />
            </Box>
            <Box position={'absolute'} zIndex={100} right={scale(1)}>
              <TouchableOpacity onPress={onClose} style={ALIGN_ITEM_FLEX_END}>
                <BuyCryptoCloseLight />
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = ScaledSheet.create({
  okButton: {
    height: scale(36),
    paddingHorizontal: scale(20),
  },
})

export default SpeedUpModal

import React from 'react'
import {
  Modal,
  ViewStyle,
  TouchableWithoutFeedback,
  useColorScheme,
} from 'react-native'
import { Box, Pressable, Text } from '../../../theme'
import { useRecoilValue } from 'recoil'
import { themeMode } from '../../../atoms'
import { Fonts, AppIcons } from '../../../assets'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { SCREEN_PADDING } from '../../../utils'

const { ModalClose, GasDarkRect, GasLightRect } = AppIcons

type GasModalProps = {
  closeModal: () => void
  isVisible: boolean
}

const defaultPadding: ViewStyle = {
  padding: scale(SCREEN_PADDING),
}

const GasModal: React.FC<GasModalProps> = ({ closeModal, isVisible }) => {
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  const backgroundColor =
    currentTheme === 'dark' ? 'semiTransparentDark' : 'semiTransparentWhite'

  const LowerBgSvg = currentTheme === 'light' ? GasDarkRect : GasLightRect

  const UpperBgSvg = currentTheme === 'dark' ? GasDarkRect : GasLightRect

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      style={styles.modalView}>
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor={backgroundColor}
        paddingHorizontal="onboardingPadding">
        <Box width="100%" height={scale(250)}>
          <Box flex={1} justifyContent={'center'} style={defaultPadding}>
            <Text
              color={'textColor'}
              paddingTop="s"
              style={styles.helpUsTextStyle}
              tx="gas"
            />
            <Text
              color={'textColor'}
              marginTop={'m'}
              variant={'normalText'}
              tx="gasInfo"
            />
            <Box marginTop={'m'}>
              <Pressable
                label={{ tx: 'gotIt' }}
                onPress={closeModal}
                variant="solid"
                style={styles.gotItBtn}
              />
            </Box>
          </Box>
          <TouchableWithoutFeedback onPress={closeModal}>
            <Box position={'absolute'} right={scale(-5)}>
              <ModalClose />
            </Box>
          </TouchableWithoutFeedback>
          <Box position={'absolute'} zIndex={-1}>
            <UpperBgSvg />
          </Box>
          <Box
            position={'absolute'}
            zIndex={-2}
            left={scale(10)}
            top={scale(22)}>
            <LowerBgSvg />
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

const styles = ScaledSheet.create({
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lowerBgImg: {
    height: '98%',
    marginLeft: scale(10),
  },
  upperBgImg: {
    height: '100%',
    marginTop: scale(-8),
    marginLeft: scale(-8),
  },
  helpUsTextStyle: {
    fontFamily: Fonts.Regular,
    fontWeight: '500',
    fontSize: scale(24),
    lineHeight: scale(30),
    textAlign: 'left',
  },
  gotItBtn: {
    height: scale(36),
    width: scale(77),
  },
})

export default GasModal

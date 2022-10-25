import React, { FC, useEffect } from 'react'
import { View, StyleSheet, Modal } from 'react-native'
import { useRecoilValue } from 'recoil'

import { Fonts } from '../../assets'
import { accountForAssetState, networkState } from '../../atoms'
import { Button, palette, Text } from '../../theme'
import { approveWalletConnect } from '../../controllers/walletConnectController'

type ApproveInjectionModal = {
  setShowInjectionModal: (param: boolean) => void
  payload: Object
}

const ApproveInjectionModal: FC<ApproveInjectionModal> = (props) => {
  const ethAccount = useRecoilValue(accountForAssetState('ETH'))
  const activeNetwork = useRecoilValue(networkState)

  const { setShowInjectionModal, payload } = props
  console.log(payload, 'payload URI FUUULLLin approve inj')
  console.log(payload.payload.params[0], 'metadata paramos')
  const handleClickOk = () => {
    approveWalletConnect(
      payload.uri,
      ethAccount,
      payload.payload.params[0].chainId,
      payload.connector,
      activeNetwork,
    )
    setShowInjectionModal(false)
  }

  useEffect(() => {}, [])

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      style={styles.modalView}>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text
            style={[styles.content, styles.header]}
            tx="APPROVE INJECTION"
          />
          <Text style={styles.content} tx="Halli hallo" />

          <Button
            type="secondary"
            variant="l"
            label={{ tx: 'common.ok' }}
            onPress={handleClickOk}
            isBorderless={false}
            isActive={true}
          />
        </View>
      </View>
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

export default ApproveInjectionModal

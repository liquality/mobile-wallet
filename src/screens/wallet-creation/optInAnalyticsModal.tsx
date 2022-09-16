import { Modal, StyleSheet, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Button } from '../../theme'
import { useNavigation } from '@react-navigation/core'
import CheckBox from '../../components/checkbox'
import { useRecoilState } from 'recoil'
import { optInAnalyticsState } from '../../atoms'
import { Text } from '../../components/text/text'
import { Fonts } from '../../assets'

type AnalyticsModalProps = {
  onAction: (params: boolean) => void
  nextScreen: string
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  onAction,
  nextScreen,
}) => {
  const navigation = useNavigation()
  const [userHasChecked, setUserHasChecked] = useState<boolean>(true)
  const [analytics, setAnalytics] = useRecoilState(optInAnalyticsState)

  const handleOkButtonPress = useCallback(() => {
    onAction(false)
    setAnalytics({
      ...(analytics || {}),
      acceptedDate: userHasChecked ? Date.now() : undefined,
    })
    navigation.navigate(nextScreen, {
      termsAcceptedAt: Date.now(),
      previousScreen: 'Entry',
    })
  }, [
    onAction,
    setAnalytics,
    analytics,
    userHasChecked,
    navigation,
    nextScreen,
  ])

  const handleCheckBox = useCallback(() => {
    setUserHasChecked(!userHasChecked)
  }, [userHasChecked])

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
            tx="optInAnalyticsModal.helpUsToImprove"
          />
          <Text
            style={styles.content}
            tx="optInAnalyticsModal.shareWhereYouClick"
          />
          <CheckBox
            selected={userHasChecked}
            onPress={handleCheckBox}
            textStyle={styles.checkBoxText}
            style={styles.checkBoxStyle}
            color={'#000D35'}
            text={{ tx: 'optInAnalyticsModal.shareMyClicks' }}
          />
          <Button
            type="secondary"
            variant="l"
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
    fontFamily: Fonts.Regular,
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
  checkBoxText: {
    fontFamily: Fonts.Regular,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 10,
  },
  checkBoxStyle: {
    marginTop: 10,
    marginBottom: 20,
  },
})

export default AnalyticsModal

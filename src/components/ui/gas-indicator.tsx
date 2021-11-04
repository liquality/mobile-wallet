import { FeeDetails } from '@liquality/types/lib/fees'
import { useEffect, useState } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faTachometerAltAverage,
  faTachometerAltFast,
  faTachometerAltFastest,
  faTachometerAltSlow,
  faTachometerAltSlowest,
} from '@fortawesome/pro-duotone-svg-icons'
import { StyleSheet, Text, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import * as React from 'react'

const GasIndicator = ({
  balance,
  gasFees,
}: {
  balance: number
  gasFees: FeeDetails
}) => {
  const [icon, setIcon] = useState<IconDefinition>(faTachometerAltSlowest)
  const [label, setLabel] = useState<string>()
  const styles = StyleSheet.create({
    gasLabel: {
      fontFamily: 'Montserrat-Regular',
      fontSize: 12,
      color: '#646F85',
    },
    gas: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    gasIcon: {
      marginRight: 5,
    },
    getGas: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingHorizontal: 10,
      borderWidth: 1,
      borderRadius: 50,
      borderColor: '#D9DFE5',
    },
  })

  useEffect(() => {
    if (balance === 0) {
      setLabel('Get Gas')
      setIcon(faTachometerAltSlowest)
    } else if (balance < gasFees.slow.fee) {
      setLabel('Add Gas')
      setIcon(faTachometerAltSlow)
    } else if (balance < gasFees.average.fee) {
      setLabel('Gas')
      setIcon(faTachometerAltAverage)
    } else if (balance < gasFees.fast.fee) {
      setLabel('Gas')
      setIcon(faTachometerAltFast)
    } else {
      setLabel('Gas')
      setIcon(faTachometerAltFastest)
    }
  }, [balance, gasFees])

  return (
    <View style={balance === 0 ? styles.getGas : styles.gas}>
      <FontAwesomeIcon
        size={20}
        icon={icon}
        color={'#000'}
        secondaryColor={balance === 0 ? '#FF007A' : '#1CE5C3'}
        style={styles.gasIcon}
      />
      <Text style={styles.gasLabel}>{label}</Text>
    </View>
  )
}

export default GasIndicator

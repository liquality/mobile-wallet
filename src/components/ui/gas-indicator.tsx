import * as React from 'react'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FeeDetails } from '@liquality/types/lib/fees'
import GasIcon from '../../assets/icons/gas-indicator.svg'

const GasIndicator = ({
  balance,
  gasFees,
}: {
  balance: number
  gasFees: FeeDetails
}) => {
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
    } else if (balance < gasFees.slow.fee) {
      setLabel('Add Gas')
    } else if (balance < gasFees.average.fee) {
      setLabel('Gas')
    } else if (balance < gasFees.fast.fee) {
      setLabel('Gas')
    } else {
      setLabel('Gas')
    }
  }, [balance, gasFees])

  return (
    <View style={balance === 0 ? styles.getGas : styles.gas}>
      <GasIcon width={20} height={20} style={styles.gasIcon} />
      <Text style={styles.gasLabel}>{label}</Text>
    </View>
  )
}

export default GasIndicator

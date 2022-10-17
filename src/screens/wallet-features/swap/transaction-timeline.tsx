import * as React from 'react'
import { Box, Text, ColorType, Pressable } from '../../../theme'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { labelTranslateFn } from '../../../utils'
const dotAndCircleWidth = scale(14)

type CustomComponentProps = {
  dotColor?: keyof ColorType
  customView: React.ReactElement
}

type TransactionTimelineProps = {
  startDate: string
  customComponent: Array<CustomComponentProps>
  completed: string
  transBtnLabel: string
  tranBtnPress: () => void
}

const TransactionTimeline = ({
  customComponent: CC,
  startDate,
  completed,
  tranBtnPress,
  transBtnLabel,
}: TransactionTimelineProps) => {
  return (
    <Box padding="screenPadding" backgroundColor="transGrey">
      <Box
        flexDirection={'row'}
        justifyContent="space-between"
        alignItems={'center'}>
        <Text variant={'h5'} color="greyBlack" tx="transaction" />
        <Pressable
          label={transBtnLabel}
          variant="defaultOutline"
          buttonSize="half"
          style={{ width: scale(60) }}
          onPress={tranBtnPress}
        />
      </Box>
      <Box marginVertical={'xl'}>
        <Box flexDirection={'row'} height={scale(60)}>
          <Box
            width={dotAndCircleWidth}
            borderTopColor="greyMeta"
            borderTopWidth={1}
          />
          <Text
            marginLeft={'xl'}
            variant="listText"
            style={styles.marginTopAdjust}
            color={'greyMeta'}>{`${labelTranslateFn(
            'common.started',
          )} ${startDate}`}</Text>
          <Box position={'absolute'} zIndex={-1}>
            <Box width={dotAndCircleWidth} alignItems="center">
              <Box
                height={scale(60)}
                width={scale(1)}
                backgroundColor="greyMeta"
              />
            </Box>
          </Box>
        </Box>
        {CC.map(({ dotColor = 'defaultButton', customView: CV }, index) => (
          <Box key={index} flexDirection={'row'} height={scale(80)}>
            <Box
              width={scale(20)}
              height={scale(20)}
              justifyContent="center"
              backgroundColor="transGrey">
              <Box
                width={dotAndCircleWidth}
                height={dotAndCircleWidth}
                backgroundColor={dotColor}
                borderWidth={1}
                borderColor={'defaultButton'}
                borderRadius={scale(8)}
              />
            </Box>
            <Box>{CV}</Box>
            <Box position={'absolute'} zIndex={-1}>
              <Box width={dotAndCircleWidth} alignItems="center">
                <Box
                  height={scale(80)}
                  width={scale(1)}
                  backgroundColor="greyMeta"
                />
              </Box>
            </Box>
          </Box>
        ))}
        <Box flexDirection={'row'} alignItems="flex-end">
          <Box
            width={dotAndCircleWidth}
            borderBottomColor="greyMeta"
            borderBottomWidth={1}
          />
          <Text
            marginLeft={'xl'}
            variant="listText"
            style={styles.marginBottomAdjust}
            color={'greyMeta'}>{`${labelTranslateFn(
            'common.completed',
          )} ${completed}`}</Text>
          <Box position={'absolute'} zIndex={-1} bottom={0}>
            <Box width={dotAndCircleWidth} alignItems="center">
              <Box
                height={scale(25)}
                width={scale(1)}
                backgroundColor="greyMeta"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const styles = ScaledSheet.create({
  marginTopAdjust: {
    marginTop: scale(-5),
  },
  marginBottomAdjust: {
    marginBottom: scale(-5),
  },
})

export default TransactionTimeline

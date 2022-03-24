import React from 'react'
import { FC } from 'react'
import Text from '../theme/text'
import Button from '../theme/button'
import Box from '../theme/box'

type ErrorFallbackProps = {
  error: Error
  resetError: (...args: unknown[]) => void
}
const ErrorFallback: FC<ErrorFallbackProps> = (props) => {
  const { error, resetError } = props

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      borderWidth={1}
      margin="l"
      borderColor="mainButtonBorderColor">
      <Text variant="body">Something went wrong</Text>
      <Text variant="error">{error.message}</Text>
      <Button type="primary" variant="m" label="Reset" onPress={resetError} />
    </Box>
  )
}

export default ErrorFallback
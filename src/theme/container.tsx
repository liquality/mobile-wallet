import { Box } from './box'
import React, { FC } from 'react'

type ContainerProps = {
  children: React.ReactElement
}
export const Container: FC<ContainerProps> = (props) => {
  const { children } = props

  return <Box flex={1}>{children}</Box>
}

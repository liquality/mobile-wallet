import { useEffect, useRef, useState } from 'react'
import { UseInputStateReturnType } from './types'

export const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

//Custom hook to create interval that is clearable
type Delay = number | null
type TimerHandler = (...args: any[]) => void
export const useInterval = (callback: TimerHandler, delay: Delay) => {
  const savedCallbackRef = useRef<TimerHandler>()

  useEffect(() => {
    savedCallbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handler = (...args: any[]) => savedCallbackRef.current!(...args)

    if (delay !== null) {
      const intervalId = setInterval(handler, delay)
      return () => clearInterval(intervalId)
    }
  }, [delay])
}

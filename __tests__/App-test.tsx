/**
 * @format
 */

import 'react-native'
import React from 'react'
import App from '../App'
import { render, waitFor } from '@testing-library/react-native'
import splashScreen from 'react-native-splash-screen'

it('renders correctly', async () => {
  const { getByTestId } = render(<App />)
  expect(getByTestId('main-view')).toBeTruthy()
  // await waitFor(async () => expect(getByTestId('main-view')))
  await waitFor(() => expect(splashScreen.hide).toHaveBeenCalled())
})

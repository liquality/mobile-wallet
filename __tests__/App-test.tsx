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
  expect(getByTestId('header-view')).toBeTruthy()
  await waitFor(() => expect(splashScreen.hide).toHaveBeenCalled())
})

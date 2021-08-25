/**
 * @format
 */

import 'react-native'
import React from 'react'
import App from '../App'
import { render, waitFor } from '@testing-library/react-native'
import splashScreen from 'react-native-splash-screen'

describe('Testing App.js', () => {
  it('should show splash screen', async () => {
    const { getByTestId } = render(<App />)
    expect(getByTestId('app-test')).toBeTruthy()
  })

  it('should hide splash screen', async () => {
    await waitFor(() => expect(splashScreen.hide).toHaveBeenCalled())
  })
})

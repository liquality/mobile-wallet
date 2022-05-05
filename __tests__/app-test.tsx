/**
 * @format
 */

import 'react-native'
import React from 'react'
jest.mock('../src/core/storage-manager')
import App from '../App'
import { render, waitFor } from '@testing-library/react-native'
import splashScreen from 'react-native-splash-screen'

describe('Testing App.js', () => {
  it('should show splash screen', async () => {
    const { queryByTestId } = render(<App />)
    await waitFor(() => expect(queryByTestId('app-test')).toBeTruthy())
  })

  it('should hide splash screen', async () => {
    render(<App />)
    await waitFor(() => expect(splashScreen.hide).toHaveBeenCalled())
  })
})

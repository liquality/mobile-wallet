/**
 * @format
 */
import './shim.js'
import '@ethersproject/shims'
import 'react-native-gesture-handler'
import 'react-native-url-polyfill/auto' //Need to be here for NFTs to work
import 'text-encoding' //Need to be here for NFTs to work
import { AppRegistry, LogBox } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
LogBox.ignoreLogs(['Require cycle:'])

AppRegistry.registerComponent(appName, () => App)

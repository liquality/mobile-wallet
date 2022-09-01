/**
 * @format
 */
import './shim.js'
import '@ethersproject/shims'
import 'react-native-gesture-handler'
import { AppRegistry, LogBox } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
LogBox.ignoreLogs(['Require cycle:', 'VirtualizedLists should never be nested'])

AppRegistry.registerComponent(appName, () => App)

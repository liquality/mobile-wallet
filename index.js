/**
 * @format
 */
import './shim.js'
import 'react-native-gesture-handler'
import crypto from 'crypto'
import { AppRegistry } from 'react-native'
// require('node-libs-react-native/globals');
import App from './App'
import { name as appName } from './app.json'
AppRegistry.registerComponent(appName, () => App)

/**
 * @format
 */

import {AppRegistry} from 'react-native';
// require('node-libs-react-native/globals');
import './shim.js'
import App from './App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);

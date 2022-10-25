import { DeviceEventEmitter } from 'react-native'

let emitterController

if (!emitterController) {
  emitterController = new DeviceEventEmitter()
}

export { emitterController }

// then you can directly use: "emit", "addListener", and "removeAllListeners"
//DeviceEventEmitter.emit('example.event', ['foo', 'bar', 'baz']);

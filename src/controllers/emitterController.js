import { EventEmitter } from 'events'

let emitterController

if (!emitterController) {
  emitterController = new EventEmitter()
}

export { emitterController }

// then you can directly use: "emit", "addListener", and "removeAllListeners"
//DeviceEventEmitter.emit('example.event', ['foo', 'bar', 'baz']);

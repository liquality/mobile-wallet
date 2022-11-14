import { EventEmitter } from 'events'

let emitterController

if (!emitterController) {
  emitterController = new EventEmitter()
}

export { emitterController }

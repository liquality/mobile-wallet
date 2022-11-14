import { EventEmitter } from 'events'

let emitterController: any

if (!emitterController) {
  emitterController = new EventEmitter()
}

export { emitterController }

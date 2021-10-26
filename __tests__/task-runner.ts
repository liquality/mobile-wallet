import TaskRunner from '../src/core/task-runner'
import { waitFor } from '@testing-library/react-native'

describe('Task Runner', () => {
  it('should run tasks 2 times', async () => {
    let counter = 0
    const task = (): boolean => {
      ++counter
      return true
    }
    const runner = new TaskRunner([task, task, task], 500)
    runner.start()
    await waitFor(
      () => {
        expect(counter > 0).toBeTruthy()
      },
      { interval: 3000 },
    ).catch(() => runner.stop())
    runner.stop()
  })
})

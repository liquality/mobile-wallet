type Task = () => boolean

export interface TaskRunnerI<T> {
  scheduleTasks: (tasks: T[]) => number
  start: () => void
  stop: () => void
}

class TaskRunner implements TaskRunnerI<Task> {
  tasks: Task[]
  interval: number
  handle: any

  constructor(tasks: Task[], interval: number) {
    if (!tasks || tasks.length === 0) {
      throw new Error('No tasks provided')
    }
    this.tasks = tasks
    this.interval = interval
  }

  public scheduleTasks(tasks: Task[]): number {
    return this.tasks.push(...tasks)
  }

  public start() {
    this.handle = setInterval(
      () => this.runNextTask(this.tasks).next(),
      this.interval,
    )
  }

  public stop() {
    clearInterval(this.handle)
  }

  private *runNextTask(tasks: Task[]) {
    let idx = 0
    while (true) {
      yield tasks[idx++]()
    }
  }
}

export default TaskRunner

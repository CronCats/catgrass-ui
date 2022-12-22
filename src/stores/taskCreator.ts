import { defineStore } from "pinia";
import parser from "cron-parser"
import type { Boundary, Empty, Task, TaskRequest } from "@/utils/types";
import { Interval } from "@/utils/taskHelpers";

// type: Height | Time
export function getBoundaryDiff(boundary: Boundary, type: string = 'Height', currentValue: number): any {
  if (!boundary || !boundary[type]) return { diff: 1, start: 0, end: 0 }
  // only use block height boundaries
  let start = boundary[type].start ? parseInt(boundary[type].start) : 0
  let end = boundary[type].end ? parseInt(boundary[type].end) : 0

  // adjust start based on current stuffz
  if (currentValue && currentValue >= start) start = currentValue

  // "Fail" the occurrences if the end is equal/passed start
  if (end <= start) return { diff: 1, start, end }
  return {
    diff: Math.floor(end - start),
    start,
    end
  }
}

// current block height if possible!
export function getOccurrences(task: Task, blockHeight?: number): number {
  let occurrences = 0
  const { interval, boundary } = task

  // just gunna roll with Once meaning 1
  if (interval === "Once") occurrences = 1

  // Both immediate & block required boundary logic
  if (interval === "Immediate" || (typeof interval === "object" && Object.keys(interval).includes('Block'))) {
    const { diff } = getBoundaryDiff(boundary, 'Height', blockHeight)
    
    // How many times does interval fit inside boundary?
    occurrences = Math.floor(diff / interval.Block)
  }

  // Cron string evaluates a diff kind of interval, then needs boundary logic
  if (typeof interval === "object" && Object.keys(interval).includes('Cron')) {
    // only use timestamp boundaries
    const { diff, start, end } = getBoundaryDiff(boundary, 'Time', +new Date())

    // calculate cron interval amounts
    try {
      let i = 0
      const iter = parser.parseExpression(interval.Cron, {
        currentDate: new Date(start / 1000),
        endDate: new Date(end / 1000),
        iterator: true
      })

      while (true) {
        try {
          const o: any = iter.next()
          if (o.done != true) i++
        } catch (e) {
          break;
        }
      }

      // How many times does interval fit inside boundary?
      occurrences = Math.floor(diff / i)
    } catch (e) {
      console.log('Cron Parser Error: ' + e.message);
      occurrences = 0
    }
  }

  return occurrences
}

export const useTaskCreator = defineStore(
  "purr", // go with teh flow
  {
    state: () => ({
      _task: {} as Task | TaskRequest | Empty,
      _context: {} as any,
    }),
    getters: {
      task: (state: any) => state._task,
      context: (state: any) => state._context,
      // TODO:
      isTaskValid: (state: any) => (true),
    },
    actions: {
      resetTaskCreator() {
        this._task = {}
        this._context = {}
      },
      setDefaultTask() {
        let task: TaskRequest = {
          actions: [],
          boundary: null,
          cw20_coins: [],
          interval: "Once",
          queries: null,
          transforms: null,
          stop_on_fail: false,
        }
        this._task = task
      },
      updateTask(obj: any) {
        Object.keys(obj).forEach(k => {
          this._task[k] = obj[k]
        })
        console.log('updateTask store', this._task);
      },
      updateTaskContext(obj: any) {
        Object.keys(obj).forEach(k => {
          this._context[k] = obj[k]
        })
        console.log('updateTaskContext store', this._context);
      },
      getTaskOccurrences(task?: Task, blockHeight?: number): number {
        return getOccurrences(task || this.task, blockHeight)
      },
    },
  }
);

import { defineStore } from "pinia";
import type { Empty, Task, TaskRequest } from "@/utils/types";

export const useTaskCreator = defineStore(
  "purr", // go with teh flow
  {
    state: () => ({
      _task: {} as Task | TaskRequest | Empty,
      _context: {} as any,
    }),
    getters: {
      task: (state: any) => state._task,
      // TODO:
      isTaskValid: (state: any) => (true),
      context: (state: any) => state._context,
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
          rules: null,
          stop_on_fail: false,
        }
        this._task = task
      },
      updateTask(obj: any) {
        Object.keys(obj).forEach(k => {
          this._task[k] = obj[k]
        })
      },
      updateTaskContext(obj: any) {
        Object.keys(obj).forEach(k => {
          this._context[k] = obj[k]
        })
      },
    },
  }
);

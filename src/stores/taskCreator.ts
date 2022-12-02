import { defineStore } from "pinia";
import type { Task, TaskRequest } from "@/utils/types";

// export interface TaskRequest {
//   actions: ActionForEmpty[];
//   boundary?: Boundary | null;
//   cw20_coins: Cw20Coin[];
//   interval: Interval;
//   rules?: Rule[] | null;
//   stop_on_fail: boolean;
// }

// export interface Task {
//   actions: ActionForEmpty[];
//   amount_for_one_task: GenericBalance;
//   boundary: BoundaryValidated;
//   funds_withdrawn_recurring: Coin[];
//   interval: Interval;
//   owner_id: Addr;
//   rules?: Rule[] | null;
//   stop_on_fail: boolean;
//   total_deposit: GenericBalance;
//   version: string;
// }

export const useTaskCreator = defineStore(
  "purr", // go with teh flow
  {
    state: () => ({
      _task: {} as Task | TaskRequest,
      _context: {} as any,
    }),
    getters: {
      task: (state: any) => state._task,
      context: (state: any) => state._context,
    },
    actions: {
      async setDefault() {
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
      async validate() {},
      async updateTask(obj: any) {
        this._task = obj
      },
      async updateContext(obj: any) {
        this._context = obj
      },
    },
  }
);

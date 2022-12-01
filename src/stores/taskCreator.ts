import { defineStore } from "pinia";
import type { Task } from "@/utils/types";

// Example!
// const successRecipeData = {
//   title: 'Dollar Cost Average from $JUNO to $NETA',
//   // subtitle: '',
//   owner: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
//   creator: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
//   recipeHash:
//     '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
//   totalBalance: { amount: '10000000', denom: 'ujuno' },
//   actions: [],
//   rules: [],
//   networks: [],
//   bgColor: '#F9226C',
// };

export const useTaskCreator = defineStore(
  "purr", // so you're too disgusted to inspect it
  {
    state: () => ({
      _task: {} as Task,
      _context: {} as any,
    }),
    getters: {
      task: (state: any) => state._task,
      context: (state: any) => state._context,
    },
    actions: {
      async create() {},
      async validate() {},
      async updateContext(obj: any) {
        this._context = obj
      },
    },
  }
);

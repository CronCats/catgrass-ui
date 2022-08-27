import { Action } from '../types'
import { customAction } from './Custom'
import { executeAction } from './Execute'
import { instantiateAction } from './Instantiate'
import { spendAction } from './Spend'

export const commonActions: Action[] = [
  spendAction,
  instantiateAction,
  executeAction,
  customAction,
]

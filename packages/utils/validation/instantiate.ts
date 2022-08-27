import { InstantiateMsg as CwCoreInstantiateMsg } from '@croncat-ui/state/clients/cw-core/0.1.0'

import cwCoreInstantiateJson from './instantiate_schema/cw-core.json'
import { makeValidateMsg } from './makeValidateMsg'

export const validateCwCoreInstantiateMsg =
  makeValidateMsg<CwCoreInstantiateMsg>(cwCoreInstantiateJson)

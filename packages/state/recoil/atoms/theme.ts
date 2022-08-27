import { atom } from 'recoil'

import { Theme } from '@croncat-ui/ui'

import { localStorageEffectJSON } from '../effects'

export const activeThemeAtom = atom({
  key: 'activeTheme',
  default: Theme.Light,
  effects: [localStorageEffectJSON<Theme>('activeTheme')],
})

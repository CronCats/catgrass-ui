import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

import { Theme, useThemeContext } from '@croncat-ui/ui'

export const defaultTheme = 'dark'

const ThemeToggle = () => {
  const { t } = useTranslation()
  const themeContext = useThemeContext()

  const icon =
    themeContext.theme === 'light' ? (
      <MoonIcon className="inline mr-2 w-5 h-5" />
    ) : (
      <SunIcon className="inline mr-2 w-5 h-5" />
    )

  const nextTheme = themeContext.theme === 'dark' ? Theme.Light : Theme.Dark

  return (
    <button
      className="flex items-center link-text"
      onClick={() => themeContext.updateTheme(nextTheme)}
      type="button"
    >
      {icon}
    </button>
  )
}

export default ThemeToggle

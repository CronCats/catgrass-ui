
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { ArrowUpRight } from '@croncat-ui/icons'
import { Button } from '@croncat-ui/ui'

interface EnterAppButtonProps {
  small?: boolean
}

export const EnterAppButton = ({ small }: EnterAppButtonProps) => {
  const { t } = useTranslation()

  return (
    <Link href="/home">
      <a>
        <Button size={small ? 'sm' : 'lg'}>
          {t('splash.cta')}
          <ArrowUpRight color="currentColor" height="10px" width="10px" />
        </Button>
      </a>
    </Link>
  )
}

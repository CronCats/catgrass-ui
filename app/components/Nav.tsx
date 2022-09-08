import {
  CogIcon,
  CommandLineIcon,
  MapIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
  Square2StackIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'
import { UserCircleIcon as UserCircleSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'

import { Logo } from '@croncat-ui/ui'

export const Nav = () => {
  const { t } = useTranslation()

  const navData = [
    {
      title: t('nav.explore'),
      href: '/explore'
    },
    {
      title: t('nav.agents'),
      href: '/agents',
      sub: [
        {
          icon: CommandLineIcon,
          title: t('nav.setup'),
          subtitle: t('nav.setupSub'),
          href: '/agents/setup',
        },
        {
          icon: QuestionMarkCircleIcon,
          title: t('nav.faqs'),
          subtitle: t('nav.faqsSub'),
          href: '/faqs',
        },
      ]
    },
    {
      title: t('nav.more'),
      href: '#',
      sub: [
        {
          icon: PresentationChartLineIcon,
          title: t('nav.stats'),
          subtitle: t('nav.statsSub'),
          href: '/stats',
        },
        {
          icon: MapIcon,
          title: t('nav.docs'),
          subtitle: t('nav.docsSub'),
          href: 'https://docs.cron.cat',
        },
      ]
    },
    {
      icon: UserCircleSolidIcon,
      className: 'inline -mr-3 ml-2 w-8 h-8',
      href: '#',
      sub: [
        {
          icon: WalletIcon,
          title: t('nav.myAccounts'),
          subtitle: t('nav.myAccountsSub'),
          href: '/profile/accounts',
        },
        {
          icon: Square2StackIcon,
          title: t('nav.myRecipes'),
          subtitle: t('nav.myRecipesSub'),
          href: '/profile/recipes',
        },
        {
          icon: CogIcon,
          title: t('nav.settings'),
          subtitle: t('nav.settingsSub'),
          href: '/profile/settings',
        },
      ]
    },
  ]

  return (
    <>
      <nav className="fixed top-0 z-40 justify-between py-2 px-6 pr-2 w-full backdrop-blur navbar backdrop-filter">
        <div className="flex-1">
          <Link href="/">
            <a>
              <Logo size={42} />
            </a>
          </Link>
        </div>
        <div className="flex-none hidden">
          <ul className="p-0 menu menu-horizontal">
            {navData.map((item, index) => (
              <li className="mr-4" tabIndex={index}>
                <a className="text-lg font-bold" href={item.href}>
                  {(item.icon) ? (
                    <item.icon className={item.className} />
                  ) : ''}
                  {(item.title) ? (
                    <span className="-mr-2">{item.title}</span>
                  ) : ''}
                  {(item.sub && item.sub.length > 0) ? (
                    <svg
                      className="fill-current"
                      height="20"
                      viewBox="0 0 24 24"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                    </svg>
                  ) : ''}
                </a>
                {(item.sub && item.sub.length > 0) ? (
                  <ul className="right-0 p-2 bg-white shadow">
                    {item.sub.map((sub, i) => (
                      <li className="hover:bg-gray-200 rounded-md">
                        <a href={sub.href}>
                          <NavSubItem
                            Icon={sub.icon}
                            subtitle={sub.subtitle}
                            title={sub.title}
                          />
                        </a>
                      </li>
                    ))}
                  </ul>) : ''
                }
              </li>
            ))}
            {/* <li><a><ThemeToggle /></a></li> */}
          </ul>
        </div>
      </nav>
    </>
  )
}

interface NavSubItemProps {
  Icon: ComponentType
  title: string
  subtitle: string
}

const NavSubItem = ({ Icon, title, subtitle }: NavSubItemProps) => (
  <>
    <div className="inline mr-0 w-8 h-8">
      <Icon />
    </div>
    <div className="flex-col">
      <p className="leading-3">{title}</p>
      <small className="text-xs text-gray-400">{subtitle}</small>
    </div>
  </>
)

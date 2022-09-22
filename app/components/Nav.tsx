import {
  // ArrowSmallLeftIcon,
  Bars3BottomRightIcon,
  CogIcon,
  CommandLineIcon,
  MapIcon,
  NewspaperIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
  Square2StackIcon,
  WalletIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { UserCircleIcon as UserCircleSolidIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import Link from 'next/link'
import { ComponentType, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Logo } from '@croncat-ui/ui'

export const Nav = () => {
  const { t } = useTranslation()

  const [menuActive, setMenuActive] = useState(false)

  const toggleActive = () => {
    setMenuActive(!menuActive)
  }

  const navData = [
    {
      title: t('nav.explore'),
      href: '/explore',
      hideSubDesktop: true,
      sub: [
        {
          icon: NewspaperIcon,
          title: t('nav.explore'),
          subtitle: t('nav.exploreSub'),
          href: '/explore',
          sort: 1,
        },
      ],
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
          sort: 9,
        },
        {
          icon: QuestionMarkCircleIcon,
          title: t('nav.faqs'),
          subtitle: t('nav.faqsSub'),
          href: '/faqs',
          sort: 10,
        },
      ],
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
          sort: 8,
        },
        {
          icon: MapIcon,
          title: t('nav.docs'),
          subtitle: t('nav.docsSub'),
          href: 'https://docs.cron.cat',
          sort: 7,
        },
      ],
    },
    {
      icon: UserCircleSolidIcon,
      className: 'inline md:-mr-3 md:ml-2 w-8 h-8',
      href: '#',
      sub: [
        {
          icon: WalletIcon,
          title: t('nav.myAccounts'),
          subtitle: t('nav.myAccountsSub'),
          href: '/profile/accounts',
          sort: 2,
        },
        {
          icon: Square2StackIcon,
          title: t('nav.myRecipes'),
          subtitle: t('nav.myRecipesSub'),
          href: '/profile/recipes',
          sort: 3,
        },
        {
          icon: CogIcon,
          title: t('nav.settings'),
          subtitle: t('nav.settingsSub'),
          href: '/profile/settings',
          sort: 4,
        },
      ],
    },
  ]

  const mobileNav = navData
    .map(({ sub }) => {
      return sub
    })
    .reduce((pre, cur) => {
      return pre.concat(cur)
    }, [])
    .sort((a, b) => a.sort - b.sort)

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-40 justify-between w-full backdrop-blur md:py-2 md:px-6 navbar backdrop-filter">
        <div className="flex-none md:hidden">
          <div className="w-6 h-6">
            {/* <ArrowSmallLeftIcon className="w-6 h-6" /> */}
          </div>
        </div>
        <div className="flex">
          <Link className="w-9 h-9 md:w-10 md:h-10" href="/">
            <div className="flex">
              <Logo size={42} />
              <div className="my-auto ml-4 badge badge-md">ALPHA</div>
            </div>
          </Link>
        </div>
        <div className="flex-none md:hidden">
          <div onClick={toggleActive}>
            {menuActive ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3BottomRightIcon className="w-6 h-6" />
            )}
          </div>
        </div>

        <div
          className={clsx(
            'fixed top-16 right-0 bottom-0 left-0 flex-none w-full h-fit bg-white rounded-t-xl shadow md:hidden',
            { 'flex-none': menuActive, hidden: !menuActive }
          )}
          data-note="mobile menu"
        >
          <ul className="p-3 w-full list-none">
            {mobileNav.map((item, index) => (
              <li
                key={index}
                className="flex p-2 mb-2 hover:bg-gray-200 active:bg-gray-200 rounded-md"
              >
                <a href={item.href}>
                  <NavSubItem
                    Icon={item.icon}
                    subtitle={item.subtitle}
                    title={item.title}
                  />
                </a>
              </li>
            ))}
            <li>
              <button className="py-0 px-5 my-8 mx-auto w-full text-xs tracking-widest text-gray-50 bg-green-600 hover:bg-green-700 rounded-full border-0 btn">
                Create Recipe
              </button>
            </li>
          </ul>
        </div>

        <div
          className="flex-none xs:hidden sm:hidden md:flex"
          data-note="desktop menu"
        >
          <ul className="p-0 menu menu-horizontal">
            {navData.map((item, index) => (
              <li key={index} className="mr-4" tabIndex={index}>
                <a className="text-lg font-bold" href={item.href}>
                  {item.icon ? <item.icon className={item.className} /> : ''}
                  {item.title ? (
                    <span className="-mr-2">{item.title}</span>
                  ) : (
                    ''
                  )}
                  {item.sub && item.sub.length > 0 && !item.hideSubDesktop ? (
                    <svg
                      className="fill-current"
                      height="20"
                      viewBox="0 0 24 24"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                    </svg>
                  ) : (
                    ''
                  )}
                </a>
                {item.sub && item.sub.length > 0 && !item.hideSubDesktop ? (
                  <ul className="right-0 p-2 bg-white shadow">
                    {item.sub.map((sub, i) => (
                      <li key={i} className="hover:bg-gray-200 rounded-md">
                        <a className="flex" href={sub.href}>
                          <NavSubItem
                            Icon={sub.icon}
                            subtitle={sub.subtitle}
                            title={sub.title}
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  ''
                )}
              </li>
            ))}
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
  <div className="flex">
    <div className="inline mr-2 w-8 h-8">
      <Icon />
    </div>
    <div className="flex-col">
      <p className="leading-3">{title}</p>
      <small className="text-xs text-gray-400">{subtitle}</small>
    </div>
  </div>
)

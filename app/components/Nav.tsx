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
        <div className="flex-none">
          <ul className="p-0 menu menu-horizontal">
            <li>
              <a className="mr-4 text-lg font-bold">Explore</a>
            </li>
            <li className="mr-4" tabIndex={0}>
              <a className="text-lg font-bold">
                <span className="-mr-2">Agents</span>
                <svg
                  className="fill-current"
                  height="20"
                  viewBox="0 0 24 24"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
              </a>
              <ul className="right-0 p-2 bg-white shadow">
                <li className="hover:bg-gray-200 rounded-md">
                  <a>
                    <NavSubItem
                      Icon={CommandLineIcon}
                      subtitle="Install & become an agent"
                      title="Setup"
                    />
                  </a>
                </li>
                <li className="hover:bg-gray-200 rounded-md">
                  <a>
                    <NavSubItem
                      Icon={QuestionMarkCircleIcon}
                      subtitle="Helpful answers & resources"
                      title="FAQs"
                    />
                  </a>
                </li>
              </ul>
            </li>
            <li tabIndex={1}>
              <a className="text-lg font-bold">
                <span className="-mr-2">More</span>
                <svg
                  className="fill-current"
                  height="20"
                  viewBox="0 0 24 24"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
              </a>
              <ul className="right-0 p-2 bg-white shadow">
                <li className="hover:bg-gray-200 rounded-md">
                  <a
                    href="https://docs.cron.cat"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <NavSubItem
                      Icon={PresentationChartLineIcon}
                      subtitle="Operations & growth analytics"
                      title="Stats"
                    />
                  </a>
                </li>
                <li className="hover:bg-gray-200 rounded-md">
                  <a
                    href="https://docs.cron.cat"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <NavSubItem
                      Icon={MapIcon}
                      subtitle="Developer references & SDKs"
                      title={t('title.documentation')}
                    />
                  </a>
                </li>
              </ul>
            </li>
            {/* <li tabIndex={2} className="ml-4 mr-6">
              <div className="p-0 active:bg-transparent hover:bg-transparent">
                <button className="btn bg-white hover:bg-white text-black border-0 rounded-full text-xs tracking-widest px-5 py-0">Create Recipe</button>
              </div>
            </li> */}
            <li tabIndex={3}>
              <a>
                <UserCircleSolidIcon className="inline -mr-3 ml-2 w-8 h-8" />
                <svg
                  className="fill-current"
                  height="20"
                  viewBox="0 0 24 24"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
              </a>
              <ul className="right-0 p-2 bg-white shadow">
                <li className="hover:bg-gray-200 rounded-md">
                  <a
                    href="https://docs.cron.cat"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <NavSubItem
                      Icon={WalletIcon}
                      subtitle="Manage your connected networks & accounts"
                      title="My Accounts"
                    />
                  </a>
                </li>
                <li className="hover:bg-gray-200 rounded-md">
                  <a
                    href="https://docs.cron.cat"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <NavSubItem
                      Icon={Square2StackIcon}
                      subtitle="Watch & manage automated tasks"
                      title="My Recipes"
                    />
                  </a>
                </li>
                <li className="hover:bg-gray-200 rounded-md">
                  <a
                    href="https://docs.cron.cat"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <NavSubItem
                      Icon={CogIcon}
                      subtitle="Notifications, preferences & more"
                      title="Settings"
                    />
                  </a>
                </li>
              </ul>
            </li>
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


import {
  UserCircleIcon,
  MapIcon,
} from '@heroicons/react/outline'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Logo } from '@croncat-ui/ui'
import ThemeToggle from 'components/ThemeToggle'

export const Nav = () => {
  const { t } = useTranslation()

  return (
    <>
      <nav className="navbar fixed top-0 justify-between py-2 px-6 pr-2 w-full backdrop-blur backdrop-filter">
        <div className="flex-1">
          <Link href="/">
            <a>
              <Logo size={42} />
            </a>
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal p-0">
            <li><a className="font-bold text-lg mr-2">Explore</a></li>
            <li tabIndex={0} className="mr-2">
              <a className="font-bold text-lg">
                <span className="-mr-2">Agents</span>
                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
              </a>
              <ul className="p-2 bg-white right-0 shadow">
                <li><a>Setup</a></li>
                <li><a>FAQs</a></li>
              </ul>
            </li>
            <li tabIndex={1}>
              <a className="font-bold text-lg">
                <span className="-mr-2">More</span>
                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
              </a>
              <ul className="p-2 bg-white right-0 shadow">
                <li>
                  <a
                    href="https://docs.cron.cat"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <MapIcon className="inline mr-0 w-5 h-5" />
                    <span>Stats</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.cron.cat"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <MapIcon className="inline mr-0 w-5 h-5" />
                    <span>{t('title.documentation')}</span>
                  </a>
                </li>
              </ul>
            </li>
            <li tabIndex={2} className="ml-4 mr-4">
              <div className="p-0">
                <button className="btn bg-white hover:bg-white text-black border-0 rounded-full text-xs px-6">Create Recipe</button>
              </div>
            </li>
            <li tabIndex={3}>
              <a>
                <UserCircleIcon className="inline ml-2 -mr-3 w-8 h-8" />
                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
              </a>
              <ul className="p-2 bg-white right-0 shadow">
                <li>
                  <a
                    href="https://docs.cron.cat"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <MapIcon className="inline mr-0 w-5 h-5" />
                    <span>My Accounts</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.cron.cat"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <MapIcon className="inline mr-0 w-5 h-5" />
                    <span>My Recipes</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.cron.cat"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <MapIcon className="inline mr-0 w-5 h-5" />
                    <span>Settings</span>
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

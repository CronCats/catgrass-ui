import {
  ArrowRightOnRectangleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState } from 'react'

import { Account, AccountNetwork } from '@croncat-ui/actions'
import { LogoFromImage, Balance } from '@croncat-ui/ui'

export interface AccountSelectorProps {
  accounts: Account[]
  onSelectedAccount: (account: Account) => void
}

export const AccountSelector = ({
  accounts,
  onSelectedAccount,
}: AccountSelectorProps) => {
  const [toggleActive, setToggleActive] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(accounts[0])

  const toggleList = () => {
    setToggleActive(!toggleActive)
  }

  const selectAccount = (account: Account) => {
    toggleList()
    setSelectedAccount(account)
    onSelectedAccount(account)
  }

  const onConnectAccount = (account: Account) => {
    toggleList()
    setSelectedAccount(account)
    onSelectedAccount(account)
  }

  return (
    <div className="relative">
      <div
        className="flex z-10 mb-2 rounded-lg border-2 cursor-pointer"
        style={{ borderColor: selectedAccount.chain?.brandColor }}
      >
        <div
          className="flex-col w-full mr-2"
          onClick={toggleList}
          style={{ minWidth: '42px' }}
        >
          <AccountItem account={selectedAccount} hideBalance={true} />
        </div>
        <div className="flex my-auto mr-4 w-6">
          {toggleActive ? (
            <ChevronUpIcon />
          ) : (
            <ChevronDownIcon />
          )}
        </div>
      </div>

      <div
        className={clsx(
          'flex-col absolute top-12 -right-1 -left-1 z-20 p-1 bg-white shadow-lg rounded-lg border-2',
          {
            visible: toggleActive === true,
            invisible: toggleActive === false,
          }
        )}
      >
        {accounts.map((account) => (
          <div key={account.address} onClick={() => {selectAccount(account)}} className="rounded-lg hover:bg-gray-200 active:bg-gray-200">
            <AccountItem account={account} hideBalance={false} />
          </div>
        ))}
        <div>
          <div className="p-2">
            <button
              className="py-0 px-5 w-full text-xs tracking-widest text-black bg-primary hover:bg-secondary rounded-full border-0 btn"
              onClick={() => onConnectAccount(selectedAccount)}
            >
              Connect Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface AccountItemProps {
  account: Account,
  hideBalance: boolean
}

const AccountItem = ({
  account: { title, address, balance, chain },
  hideBalance = false
}: AccountItemProps) => (
  <div className="flex p-2 justify-between cursor-pointer w-full">
    <div className="flex my-auto w-full">
      <div
        className="flex-col"
        style={{ minWidth: '42px' }}
      >
        <LogoFromImage
          className="block mr-4"
          rounded={true}
          size="42"
          src={chain?.asset?.logo_URIs?.png || ''}
        />
      </div>
      <div className="flex-col m-auto w-full">
        <h3 className="text-lg font-bold leading-4">
          {title}
        </h3>
        <div className="flex flex-col md:flex-row w-10/12 md:w-full justify-between">
          <small className="inline md:block overflow-hidden w-full h-10/12 md:h-auto md:w-1/2 mr-auto text-xs text-gray-400 lowercase text-ellipsis">
            {address}
          </small>
          {hideBalance === false ? (
            <small className="inline md:block grow h-10/12 md:h-auto md:w-1/2 text-xs md:text-right text-gray-400 uppercase">
              <Balance {...balance} decimals={6} />
            </small>
          ) : ''}
        </div>
      </div>
    </div>
  </div>
)

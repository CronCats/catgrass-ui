import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState } from 'react'

import { Account, AccountNetwork } from '@croncat-ui/actions'
import { Balance, LogoFromImage } from '@croncat-ui/ui'

export interface NetworkAccountSelectorProps {
  accountNetworks: AccountNetwork[]
  onConnectAccount: (network: AccountNetwork) => void
  disabled?: boolean
}

export const NetworkAccountSelector = ({
  accountNetworks,
  onConnectAccount,
  disabled,
}: NetworkAccountSelectorProps) => {
  const [selectedNetworkActive, setSelectedNetworkActive] = useState(false)
  const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0)

  const toggleNetwork = (index: number) => {
    setSelectedNetworkIndex(index)
    setSelectedNetworkActive(!selectedNetworkActive)
  }

  return (
    <div>
      {accountNetworks.map((network, index) => (
        <div key={index} className="relative">
          <div
            className={clsx(
              'flex z-10 px-2 mb-2 bg-white rounded-lg border-2 cursor-pointer',
              { 'opacity-30': disabled }
            )}
            style={{ borderColor: network.network.brandColor }}
          >
            <div
              className="flex-col py-2 mr-2"
              onClick={() => {
                if (network.accounts.length > 0) {
                  toggleNetwork(index)
                }
              }}
              style={{ minWidth: '42px' }}
            >
              <LogoFromImage
                className="block"
                rounded={true}
                size="42"
                src={network.network.asset?.logo_URIs?.png || ''}
              />
            </div>
            <div
              className="flex-col py-2 m-auto w-full"
              onClick={() => {
                if (network.accounts.length > 0) {
                  toggleNetwork(index)
                }
              }}
            >
              <h3 className="text-lg font-bold leading-4">
                {network.network.chain?.pretty_name}
              </h3>
              <small className="text-xs text-gray-400 lowercase">
                {network.network.chain?.chain_id}
                {network.accounts.length > 0
                  ? `, ${network.accounts.length} account${
                      network.accounts.length > 1 ? 's' : ''
                    }`
                  : ''}
              </small>
            </div>
            <div
              className={clsx('flex my-auto w-6', {
                hidden: disabled || network.accounts.length < 1,
              })}
            >
              {selectedNetworkIndex === index &&
              selectedNetworkActive === true ? (
                <ChevronUpIcon />
              ) : (
                <ChevronDownIcon />
              )}
            </div>
            <div
              className={clsx('flex my-auto', {
                hidden: disabled || network.accounts.length > 0,
              })}
            >
              <button
                className="py-0 px-5 w-full text-xs tracking-widest text-gray-50 bg-gray-700 hover:bg-gray-900 rounded-full border-0 btn"
                onClick={() => onConnectAccount(network)}
              >
                Connect
              </button>
            </div>
          </div>

          <ul
            className={clsx(
              'absolute top-12 -right-1 -left-1 z-20 bg-white rounded-lg border-2 border-gray-100 shadow-xl menu',
              {
                hidden: disabled,
                visible:
                  selectedNetworkIndex === index &&
                  selectedNetworkActive === true,
                invisible:
                  selectedNetworkIndex !== index ||
                  selectedNetworkActive === false,
              }
            )}
          >
            {network.accounts.map((account) => (
              <li key={account.address}>
                <AccountItem
                  account={account}
                  onLogout={() => onConnectAccount(network)}
                />
              </li>
            ))}
            <li>
              <div className="p-2">
                <button
                  className="py-0 px-5 w-full text-xs tracking-widest text-black bg-primary hover:bg-secondary rounded-full border-0 btn"
                  onClick={() => onConnectAccount(network)}
                >
                  Connect Account
                </button>
              </div>
            </li>
          </ul>
        </div>
      ))}
    </div>
  )
}

interface AccountItemProps {
  account: Account
  onLogout: () => void
}

const AccountItem = ({
  account: { title, address, balance },
  onLogout,
}: AccountItemProps) => (
  <div className="flex justify-between w-full active:text-gray-800 hover:bg-transparent focus:bg-transparent active:bg-gray-300 active:bg-transparent cursor-default">
    <div className="flex-col my-auto w-10/12">
      <h3 className="text-lg leading-4">{title}</h3>
      <div className="flex w-full">
        {/* <small className="text-xs text-gray-400 lowercase">{address.substring(0,20)}...</small> */}
        <small className="overflow-hidden w-1/2 text-xs text-gray-400 lowercase text-ellipsis">
          {address}
        </small>
        <small className="ml-auto w-1/2 text-xs text-right text-gray-400 uppercase">
          <Balance {...balance} decimals={6} />
        </small>
      </div>
    </div>
    <div
      className="px-2 text-right cursor-pointer"
      onClick={onLogout}
      title="Logout"
    >
      <ArrowRightOnRectangleIcon className="inline mr-0 w-5 h-5 text-gray-400 hover:text-gray-700" />
    </div>
  </div>
)

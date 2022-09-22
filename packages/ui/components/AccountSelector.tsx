import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState } from 'react'

import { Account } from '@croncat-ui/actions'
import { Balance, LogoFromImage } from '@croncat-ui/ui'

export interface AccountSelectorValue {
  value: any
}

export interface AccountSelectorOption {
  key: string
  value: any
}

export interface AccountSelectorProps {
  options: AccountSelectorOption[]
  onChange: (value: any) => void
  containerClassName?: string
  className?: string
}

export const AccountSelector = ({
  options,
  onChange,
  containerClassName,
  className,
  ...props
}: AccountSelectorProps) => {
  const [toggleActive, setToggleActive] = useState(false)
  const [state, setState] = useState(options[0])

  const toggleList = () => {
    setToggleActive(!toggleActive)
  }

  // TODO: Hook in wallet connector modal
  const onConnectAccount = (account: Account) => {
    toggleList()
  }

  const updateSelect = (item: any) => {
    setState({ ...item })
    onChange(item)
    toggleList()
  }

  return (
    <div className="relative">
      <div
        className="flex z-10 mb-2 bg-white rounded-lg border-2 cursor-pointer"
        style={{ borderColor: state.value.chain?.brandColor }}
      >
        <div
          className="flex-col mr-2 w-full"
          onClick={toggleList}
          style={{ minWidth: '42px' }}
        >
          <AccountItem account={state.value} hideBalance={true} />
        </div>
        <div className="flex my-auto mr-4 w-6">
          {toggleActive ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
      </div>

      <div
        className={clsx(
          'absolute top-12 -right-1 -left-1 z-20 flex-col p-1 bg-white rounded-lg border-2 shadow-lg',
          {
            visible: toggleActive === true,
            invisible: toggleActive === false,
          }
        )}
      >
        {options.map((item) => (
          <div
            key={item.value.address}
            className="hover:bg-gray-200 active:bg-gray-200 rounded-lg"
            onClick={() => {
              updateSelect(item)
            }}
          >
            <AccountItem account={item.value} hideBalance={false} />
          </div>
        ))}
        <div>
          <div className="p-2">
            <button
              className="py-0 px-5 w-full text-xs tracking-widest text-black bg-primary hover:bg-secondary rounded-full border-0 btn"
              onClick={() => onConnectAccount(state.value)}
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
  account: Account
  hideBalance: boolean
}

const AccountItem = ({
  account: { title, address, balance, chain },
  hideBalance = false,
}: AccountItemProps) => (
  <div className="flex justify-between p-2 w-full cursor-pointer">
    <div className="flex my-auto w-full">
      <div className="flex-col" style={{ minWidth: '42px' }}>
        <LogoFromImage
          className="block mr-4"
          rounded={true}
          size="42"
          src={chain?.asset?.logo_URIs?.png || ''}
        />
      </div>
      <div className="flex-col m-auto w-full">
        <h3 className="text-lg font-bold leading-4">{title}</h3>
        <div className="flex flex-col justify-between w-10/12 md:flex-row md:w-full">
          <small className="inline overflow-hidden mr-auto w-full text-xs text-gray-400 lowercase text-ellipsis md:block md:w-1/2 md:h-auto h-10/12">
            {address}
          </small>
          {hideBalance === false ? (
            <small className="inline grow text-xs text-gray-400 uppercase md:block md:w-1/2 md:h-auto md:text-right h-10/12">
              <Balance {...balance} decimals={6} />
            </small>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  </div>
)

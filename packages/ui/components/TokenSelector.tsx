import { Asset } from '@chain-registry/types'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState } from 'react'

import { LogoFromImage } from '@croncat-ui/ui'

export interface TokenSelectorValue {
  value: any
}

export interface TokenSelectorOption {
  key: string
  value: any
}

export interface TokenSelectorProps {
  options: TokenSelectorOption[]
  onChange: (value: any) => void
  containerClassName?: string
  className?: string
}

export const TokenSelector = ({
  options,
  onChange,
  containerClassName,
  className,
  ...props
}: TokenSelectorProps) => {
  const [toggleActive, setToggleActive] = useState(false)
  const [state, setState] = useState(options[0])

  const toggleList = () => {
    setToggleActive(!toggleActive)
  }

  const updateSelect = (item: any) => {
    setState({ ...item })
    toggleList()
    onChange(state)
  }

  return (
    <div>
      <div className="relative">
        <div
          className="flex z-10 bg-white rounded-lg border-2"
          onClick={toggleList}
        >
          <TokenItem value={state.value} />

          <div className="flex my-auto mr-3 w-8">
            <ChevronUpDownIcon />
          </div>
        </div>

        <div
          className={clsx(
            'overflow-y-scroll absolute top-12 -right-1 -left-1 z-20 flex-col p-1 max-h-[200px] bg-white rounded-lg border-2 shadow-lg',
            {
              visible: toggleActive === true,
              invisible: toggleActive === false,
            }
          )}
        >
          {options.map((item, index) => (
            <div
              key={index}
              className="bg-white hover:bg-gray-200 active:bg-gray-200 rounded-lg"
              onClick={() => {
                updateSelect(item)
              }}
            >
              <TokenItem value={item.value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface TokenItemProps {
  value: Asset
}

const TokenItem = ({ value }: TokenItemProps) => (
  <div className="flex px-2 w-full cursor-pointer">
    <div className="flex py-2 mr-2" style={{ minWidth: '42px' }}>
      <LogoFromImage
        className="block"
        rounded={true}
        size="42"
        src={value?.logo_URIs?.png || ''}
      />
    </div>
    <div className="flex-col py-2 m-auto w-full">
      <h3 className="text-lg font-bold leading-4">{value.symbol}</h3>
    </div>
  </div>
)

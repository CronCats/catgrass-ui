import { Asset } from '@chain-registry/types'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState } from 'react'

import { LogoFromImage } from '@croncat-ui/ui'

export interface TokenSelectorProps {
  tokens: Asset[]
  onSelectedToken: (token: Asset) => void
}

export const TokenSelector = ({
  tokens,
  onSelectedToken,
}: TokenSelectorProps) => {
  const [toggleActive, setToggleActive] = useState(false)
  const [selectedToken, setSelectedToken] = useState(tokens[0])

  const toggleList = () => {
    setToggleActive(!toggleActive)
  }

  const selectToken = (token: Asset) => {
    toggleList()
    setSelectedToken(token)
    onSelectedToken(token)
  }

  return (
    <div>
      <div className="relative">
        <div
          className="flex z-10 bg-white rounded-lg border-2"
          onClick={toggleList}
        >
          <TokenItem token={selectedToken} />

          <div className="flex my-auto mr-3 w-8">
            <ChevronUpDownIcon />
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
          {tokens.map((token, index) => (
            <div
              key={index}
              className="bg-white hover:bg-gray-200 active:bg-gray-200 rounded-lg"
              onClick={() => {
                selectToken(token)
              }}
            >
              <TokenItem token={token} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface TokenItemProps {
  token: Asset
}

const TokenItem = ({ token }: TokenItemProps) => (
  <div className="flex px-2 w-full cursor-pointer">
    <div className="flex py-2 mr-2" style={{ minWidth: '42px' }}>
      <LogoFromImage
        className="block"
        rounded={true}
        size="42"
        src={token?.logo_URIs?.png || ''}
      />
    </div>
    <div className="flex-col py-2 m-auto w-full">
      <h3 className="text-lg font-bold leading-4">{token.symbol}</h3>
    </div>
  </div>
)

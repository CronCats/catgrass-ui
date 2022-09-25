import { Chain } from '@chain-registry/types'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { ReactNode } from 'react'

import { Action, Addr, ChainMetadata, Coin, Rule } from '@croncat-ui/actions'
import { Balance, LogoFromImage } from '@croncat-ui/ui'
import { getChainMetaData } from '@croncat-ui/utils'

export interface RecipeDataProps {
  title: string
  subtitle?: string
  owner: Addr
  creator?: Addr
  creatorAlias?: string
  recipeHash?: string
  fee?: Coin
  totalBalance?: Coin

  actions: Action[]
  rules: Rule[]
  networks: Chain[]

  stats?: {
    copycats: number
    runs: number
  }
}

export interface RecipeProps {
  children?: ReactNode
  data: RecipeDataProps
  contentContainerClassName?: string
  active?: boolean
  bgColor?: string
}

export const RecipeCardComponent = ({
  children,
  contentContainerClassName,
  active,
  bgColor,
  data,
  ...props
}: RecipeProps) => {
  const recipeChains = data.networks
    .filter(function (item, pos, self) {
      return self.indexOf(item) === pos
    })
    .map(getChainMetaData)

  // TODO:
  // - title from recipe factors
  // - bg color - generated from title (HSL?)
  return (
    <div className="cursor-pointer" {...props}>
      <div
        className="relative z-20 p-6 text-white bg-pink-600 rounded-2xl"
        style={{ backgroundColor: bgColor ? bgColor : '' }}
      >
        <div>
          <h3 className="text-2xl font-bold">{data.title}</h3>
        </div>
        <div className="my-4">
          {!data.subtitle ? (
            <p className="flex overflow-hidden text-ellipsis">
              by&nbsp;
              <strong className="overflow-hidden text-ellipsis">
                {' '}
                {data.creator || data.owner}
              </strong>
            </p>
          ) : (
            <p>{data.subtitle}</p>
          )}
        </div>
        <div className="flex justify-between mt-2">
          <div className="mt-auto">
            {data.totalBalance ? (
              <Balance {...data.totalBalance} decimals={6} />
            ) : (
              ''
            )}
            {data.stats?.copycats ? <p>{data.stats?.copycats}</p> : ''}
          </div>
          <div className="flex">
            {recipeChains
              ? recipeChains.map((chain: ChainMetadata, index) => (
                  <div
                    key={index}
                    className={clsx({
                      'ml-[-12px]': index > 0,
                    })}
                  >
                    <LogoFromImage
                      className="block"
                      rounded={true}
                      size="32"
                      src={chain?.asset?.logo_URIs?.png || ''}
                    />
                  </div>
                ))
              : ''}
          </div>
        </div>
        {children}
      </div>
      {data.recipeHash ? (
        <div className="relative z-10 px-6 pt-5 pb-2 -mt-4 bg-gray-200 rounded-b-2xl">
          <div className="flex justify-between text-xs">
            <small className="overflow-hidden pr-8 my-auto w-full text-ellipsis break-normal">
              Hash:&nbsp;
              <span className="overflow-hidden text-ellipsis break-normal">
                {data.recipeHash}
              </span>
            </small>
            <DocumentDuplicateIcon className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

import clsx from 'clsx'
import {
  ComponentPropsWithoutRef,
  ComponentType,
  ForwardedRef,
  ReactNode,
} from 'react'
import {
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'

// import { Logo as DefaultLogo, LogoProps } from '../Logo'

export interface RecipeProps {
  children?: ReactNode
  // title: string
  // subtitle?: string
  // owner: Addr
  // creator: Addr
  // recipeHash: string
  // fee: Coin
  // totalBalance: Coin

  // tokens: Coin[]

  // actions: Action[]
  // networks: Chain[]

  // stats: {
  //   copycats: number
  //   runs: number
  // }
  // contentContainerClassName?: string
  // active?: boolean
  // Logo?: ComponentType<LogoProps>
}

export const RecipeCardComponent = (
  {
    children,
    // contentContainerClassName,
    // active,
    // Logo = DefaultLogo,
    ...props
  }: RecipeProps
) => {

  return (
    <div className="cursor-pointer" {...props}>
      <div className="relative z-20 p-6 rounded-2xl bg-pink-600 text-white">
        <div>
          <h3 className="text-2xl font-bold">Claim staking rewards, then DCA from $ATOM to $JUNO</h3>
        </div>
        {children}
      </div>
      <div className="relative rounded-b-2xl pt-5 px-6 pb-2 -mt-4 z-10 bg-gray-200">
        <div className="flex justify-between text-xs">
          <small className="my-auto">Recipe Hash: 9fsd8f90dsa8fds98f90afds</small>
          <DocumentDuplicateIcon className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
        </div>
      </div>
    </div>
  )
}

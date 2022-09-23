import { Chain } from '@chain-registry/types'
import { assets, chains } from 'chain-registry'
import { useEffect, useRef } from 'react'

import { chainColors } from './constants'

export const usePrevious = <T extends {}>(value: T): T | undefined => {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const getChainMetaData = (chain: Chain) => {
  const assetList = assets.find(
    ({ chain_name }) => chain_name === chain.chain_name
  )
  const asset = assetList?.assets[0]
  return {
    ...chain,
    asset,
    brandColor: chainColors[chain.chain_id],
  }
}

export const unsupportedChainIds = ['cosmoshub-4']
export const supportedChainIds = Object.keys(chainColors).filter(
  (id) => !unsupportedChainIds.includes(id)
)
export const supportedChains = chains
  .filter((c) => supportedChainIds.includes(c.chain_id))
  .map(getChainMetaData)

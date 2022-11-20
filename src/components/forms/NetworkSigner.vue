import { Chain } from '@chain-registry/types'
import { assets, chains } from 'chain-registry'
import { useTranslation } from 'react-i18next'

import { Button, InputLabel, LogoFromImage } from '@croncat-ui/ui'
import { chainColors } from '@croncat-ui/utils'

// TODO: fake data, remove once wallet finished
const getChainData = (chain: Chain) => {
  const assetList = assets.find(
    ({ chain_name }) => chain_name === chain.chain_name
  )
  const asset = assetList?.assets[0]
  return {
    chain,
    asset,
    brandColor: chainColors[chain.chain_id],
  }
}

export interface NetworkSignerProps {
  onComplete: (value: any) => void
}

export const NetworkSignerComponent = ({
  onComplete,
  ...props
}: NetworkSignerProps) => {
  // const { register, watch, setValue } = useFormContext()
  const { t } = useTranslation()

  const unsupportedChainIds = ['cosmoshub-4']
  const supportedChainIds = Object.keys(chainColors).filter(
    (id) => !unsupportedChainIds.includes(id)
  )
  const supportedChains = chains
    .filter((c) => supportedChainIds.includes(c.chain_id))
    .map(getChainData)

  const chainItems = [supportedChains[0]]

  return (
    <div aria-details="dca fields" className="my-8">
      <h3 className="mb-2 text-xl">{t('form.signer_sign_txns')}</h3>

      <div className="my-12">
        {chainItems.map((item) => (
          <div key={item.chain.chain_id}>
            <ChainItem {...item} onComplete={onComplete} />
          </div>
        ))}
      </div>

      <hr className="my-8 mx-auto w-1/2 border-2 border-gray-100" />

      <InputLabel className="mb-2" name={t('form.note')} />
      <small className="text-gray-400">{t('form.signer_note_full')}</small>

      <br />
    </div>
  )
}

const ChainItem = ({ asset, brandColor, chain, onComplete }: any) => (
  <div className="flex justify-between p-2 w-full cursor-pointer">
    <div className="flex my-auto w-full">
      <div className="flex-col py-2 mr-2" style={{ minWidth: '40px' }}>
        <LogoFromImage
          className="block mr-4"
          rounded={true}
          size="40"
          src={asset?.logo_URIs?.png || ''}
        />
      </div>
      <div className="flex-col py-2 m-auto w-full">
        <h3 className="text-lg font-bold leading-4">{chain?.pretty_name}</h3>
        <small className="text-xs text-gray-400 lowercase">
          {chain?.chain_id}
        </small>
      </div>
      <div className="flex-col py-2 m-auto w-auto">
        <Button
          className="min-w-[110px] bg-green-600 hover:bg-green-800"
          onClick={onComplete}
        >
          <span>Sign</span>
        </Button>
      </div>
    </div>
  </div>
)

import { useWalletManager } from '@noahsaso/cosmodal'
import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect } from 'react'
import { useRecoilState } from 'recoil'

import { WalletProvider } from '@croncat-ui/common'

import { installWarningVisibleAtom, noKeplrAccountAtom } from '@/atoms'

import { InstallKeplr } from './InstallKeplr'
import { Nav } from './Nav'
import { NoKeplrAccountModal } from './NoKeplrAccountModal'
// import { PageHeader } from './PageHeader'

const PageLayoutInner = ({ children }: PropsWithChildren<{}>) => {
  const router = useRouter()
  const [installWarningVisible, setInstallWarningVisible] = useRecoilState(
    installWarningVisibleAtom
  )
  const [noKeplrAccount, setNoKeplrAccount] = useRecoilState(noKeplrAccountAtom)

  //! WALLET CONNECTION ERROR MODALS
  const { error } = useWalletManager()
  useEffect(() => {
    setInstallWarningVisible(
      error instanceof Error &&
        error.message === 'Failed to retrieve wallet client.'
    )
    setNoKeplrAccount(
      error instanceof Error && error.message === "key doesn't exist"
    )
  }, [error, setInstallWarningVisible, setNoKeplrAccount])

  return (
    <>
      {installWarningVisible && (
        <InstallKeplr onClose={() => setInstallWarningVisible(false)} />
      )}
      {noKeplrAccount && (
        <NoKeplrAccountModal onClose={() => setNoKeplrAccount(false)} />
      )}

      <div className="w-full h-full">
        <Nav />
        {/* <PageHeader /> */}

        <main className="min-h-screen">{children}</main>
      </div>
    </>
  )
}

const PageLayoutLoadingInner = ({ children }: PropsWithChildren<{}>) => (
  <main className="overflow-hidden w-full h-full min-h-screen">{children}</main>
)

export const PageLayout = ({ children }: PropsWithChildren<{}>) => {
  const { isFallback } = useRouter()

  // Don't mount wallet or modals while static page data is still loading.
  // Things look weird and broken, and the wallet connects twice. Nav in
  // PageLayoutInner above uses wallet hook, which depends on WalletProvider, so
  // use placeholder Layout during fallback.
  return isFallback ? (
    <PageLayoutLoadingInner>{children}</PageLayoutLoadingInner>
  ) : (
    <WalletProvider>
      <PageLayoutInner>{children}</PageLayoutInner>
    </WalletProvider>
  )
}

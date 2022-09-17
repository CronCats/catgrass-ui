import { useWalletManager } from '@noahsaso/cosmodal'
import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect } from 'react'
import { useRecoilState } from 'recoil'

import { WalletProvider } from '@croncat-ui/common'

import { installWarningVisibleAtom, noKeplrAccountAtom } from '@/atoms'

import { Footer } from './Footer'
import { InstallKeplr } from './InstallKeplr'
import { Nav } from './Nav'
import { NoKeplrAccountModal } from './NoKeplrAccountModal'

const AppLayoutInner = ({ children }: PropsWithChildren<{}>) => {
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

        <main className="min-h-screen bg-gray-50">{children}</main>

        <Footer />
      </div>
    </>
  )
}

const AppLayoutLoadingInner = ({ children }: PropsWithChildren<{}>) => (
  <main className="overflow-hidden w-full h-full min-h-screen">{children}</main>
)

export const AppLayout = ({ children }: PropsWithChildren<{}>) => {
  const { isFallback } = useRouter()

  // Don't mount wallet or modals while static page data is still loading.
  // Things look weird and broken, and the wallet connects twice. Nav in
  // AppLayoutInner above uses wallet hook, which depends on WalletProvider, so
  // use placeholder Layout during fallback.
  return isFallback ? (
    <AppLayoutLoadingInner>{children}</AppLayoutLoadingInner>
  ) : (
    <WalletProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </WalletProvider>
  )
}

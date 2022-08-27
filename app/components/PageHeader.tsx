import { useTranslation } from 'react-i18next'

export const PageHeader = () => {
  const { t } = useTranslation()

  return (
    <div style={{backgroundColor: 'rgb(245, 245, 245)'}} className="py-8 bg-noise">
      <div className="w-1/2 m-auto mt-24 text-center">
        <h1 className="text-3xl font-bold">My Accounts</h1>
      </div>
    </div>
  )
}

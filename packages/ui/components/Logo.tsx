import clsx from 'clsx'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

export interface LogoProps {
  size?: number | string
  className?: string
  invert?: boolean
}

export const Logo = ({ size = 28 }: LogoProps) => {
  return (
    <Image
      alt="Croncat"
      height={size}
      src="/croncat_color_logo.png"
      width={size}
    />
  )
}

export const LogoNoBorder = ({ size = 28, className }: LogoProps) => {
  const { t } = useTranslation()

  return (
    <svg
      aria-label={t('info.daodaoLogo')}
      className={className}
      fill="none"
      height={size}
      viewBox={`0 0 28 28`}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M14 14C14 17.0376 16.4624 19.5 19.5 19.5C22.5376 19.5 25 17.0376 25 14C25 7.92487 20.0751 3 14 3C7.92487 3 3 7.92487 3 14C3 10.9624 5.46243 8.5 8.5 8.5C11.5376 8.5 14 10.9624 14 14ZM19.5 12.5C18.6716 12.5 18 13.1716 18 14C18 14.8284 18.6716 15.5 19.5 15.5C20.3284 15.5 21 14.8284 21 14C21 13.1716 20.3284 12.5 19.5 12.5Z"
        fillRule="evenodd"
        style={{ fill: 'rgb(var(--black))' }}
      />
    </svg>
  )
}

export interface LogoFromImageProps extends LogoProps {
  src: string
  rounded?: boolean
}

export const LogoFromImage = ({
  size = 28,
  className,
  src,
  rounded = false,
}: LogoFromImageProps) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      className={clsx(
        {
          'overflow-hidden rounded-full': rounded,
        },
        className
      )}
      height={size}
      src={src}
      width={size}
    />
  )
}

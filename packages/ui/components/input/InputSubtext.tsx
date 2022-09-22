import clsx from 'clsx'
import { ComponentProps } from 'react'

export interface InputSubtextProps
  extends Omit<ComponentProps<'small'>, 'root'> {
  error?: boolean
  className?: string
  text: string
}

export const InputSubtext = ({
  className,
  error,
  text,
  ...rest
}: InputSubtextProps) => (
  <small
    className={clsx(
      {
        'text-red-700': error,
        'text-gray-700': !error,
      },
      className
    )}
    {...rest}
  >
    {text}
  </small>
)

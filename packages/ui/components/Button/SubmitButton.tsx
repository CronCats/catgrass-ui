import clsx from 'clsx'
import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react'

enum SubmitVariant {
  Primary = 'primary',
  Secondary = 'secondary',
}

type SubmitProps = Omit<ComponentPropsWithoutRef<'input'>, 'value' | 'type'> & {
  label: string
  variant?: `${SubmitVariant}`
}

function Submit(
  {
    disabled,
    className,
    label,
    variant = SubmitVariant.Primary,
    ...rest
  }: SubmitProps,
  ref?: ForwardedRef<HTMLInputElement>
) {
  return (
    <input
      className={clsx(
        'block py-[6px] px-[16px] min-w-[110px] rounded-full transition cursor-pointer md:min-w-[190px]',
        {
          // Primary
          'text-lg text-light bg-btn': variant === SubmitVariant.Primary,
          'hover:bg-dark active:bg-toast':
            variant === SubmitVariant.Primary && !disabled,
          // Secondary
          'bg-primary link-text': variant === SubmitVariant.Secondary,
          'hover:bg-btn-secondary-hover active:bg-btn-secondary-pressed':
            variant === SubmitVariant.Secondary && !disabled,
          // Shared
          'bg-btn-disabled': disabled,
        },
        className
      )}
      disabled={disabled}
      ref={ref}
      type="submit"
      value={label}
      {...rest}
    />
  )
}

export const SubmitButton = forwardRef(Submit)

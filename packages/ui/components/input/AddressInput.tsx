import { WalletIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { ChangeEventHandler, ComponentPropsWithoutRef } from 'react'
import {
  FieldError,
  FieldPathValue,
  FieldValues,
  Path,
  UseFormRegister,
  Validate,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export interface AddressInputProps<
  FV extends FieldValues,
  FieldName extends Path<FV>
> extends Omit<ComponentPropsWithoutRef<'input'>, 'required'> {
  fieldName: FieldName
  register: UseFormRegister<FV>
  onChange?: ChangeEventHandler<HTMLInputElement>
  validation?: Validate<FieldPathValue<FV, FieldName>>[]
  error?: FieldError
  disabled?: boolean
  required?: boolean
  containerClassName?: string
}

export const AddressInput = <
  FV extends FieldValues,
  FieldName extends Path<FV>
>({
  fieldName,
  register,
  error,
  validation,
  onChange,
  disabled,
  required,
  className,
  containerClassName,
  ...rest
}: AddressInputProps<FV, FieldName>) => {
  const { t } = useTranslation()
  const validate = validation?.reduce(
    (a, v) => ({ ...a, [v.toString()]: v }),
    {}
  )

  return (
    <div
      className={clsx(
<<<<<<< HEAD
        'flex gap-1 items-center py-3 px-3 font-mono text-sm rounded-lg border-2 focus-within:outline-none focus-within:ring-2 ring-gray-400 ring-offset-0 transition border-default',
=======
        'flex gap-1 items-center py-2 px-3 font-mono text-sm bg-transparent rounded-lg border focus-within:outline-none focus-within:ring-1 ring-brand ring-offset-0 transition border-default',
>>>>>>> main
        { 'ring-1 ring-error': error },
        containerClassName
      )}
    >
<<<<<<< HEAD
      <WalletIcon className="mr-2" color="currentColor" width="24px" />
=======
      <WalletIcon color="currentColor" width="24px" />
>>>>>>> main
      <input
        className={clsx(
          'w-full bg-transparent border-none outline-none ring-none body-text',
          className
        )}
        disabled={disabled}
<<<<<<< HEAD
        placeholder={t('form.bechAddress')}
=======
        placeholder={t('form.junoAddress')}
>>>>>>> main
        type="text"
        {...rest}
        {...register(fieldName, {
          required: required && 'Required',
          validate,
          onChange,
        })}
      />
    </div>
  )
}

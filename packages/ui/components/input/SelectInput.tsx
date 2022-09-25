import clsx from 'clsx'
<<<<<<< HEAD
import { ComponentProps, ComponentType } from 'react'
=======
import { ComponentProps } from 'react'
>>>>>>> main
import {
  FieldError,
  FieldPathValue,
  FieldValues,
  Path,
  UseFormRegister,
  Validate,
} from 'react-hook-form'

export interface SelectInputProps<
  FV extends FieldValues,
  FieldName extends Path<FV>
> extends Omit<ComponentProps<'select'>, 'required'> {
  fieldName?: FieldName
  register?: UseFormRegister<FV>
  validation?: Validate<FieldPathValue<FV, FieldName>>[]
  error?: FieldError
  required?: boolean
<<<<<<< HEAD
  Icon?: ComponentType
=======
>>>>>>> main
}

export const SelectInput = <
  FV extends FieldValues,
  FieldName extends Path<FV>
>({
  fieldName,
  register,
  error,
  validation,
  children,
  required,
<<<<<<< HEAD
  Icon,
=======
>>>>>>> main
  ...props
}: SelectInputProps<FV, FieldName>) => {
  const validate = validation?.reduce(
    (a, v) => ({ ...a, [v.toString()]: v }),
    {}
  )

  return (
    <select
      className={clsx(
<<<<<<< HEAD
        'py-3 px-3 w-full text-body bg-transparent rounded-lg border-2 focus:outline-none focus:ring-2 ring-gray-400 ring-offset-0 transition border-default',
=======
        'py-2 px-3 text-body bg-transparent rounded-lg border focus:outline-none focus:ring-1 ring-brand ring-offset-0 transition border-default',
>>>>>>> main
        { 'ring-1 ring-error': error }
      )}
      {...props}
      {...(register &&
        fieldName &&
        register(fieldName, { required: required && 'Required', validate }))}
    >
      {children}
    </select>
  )
}

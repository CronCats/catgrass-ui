import clsx from 'clsx'
import { ComponentProps, ComponentType, useState } from 'react'
import {
  FieldError,
  FieldPathValue,
  FieldValues,
  Path,
  UseFormRegister,
  Validate,
} from 'react-hook-form'

export interface SelectComboItem {
  type: string
  title: string
}

export interface SelectComboInputProps<
  FV extends FieldValues,
  FieldNameInput extends Path<FV>,
  FieldNameSelect extends Path<FV>
> extends Omit<ComponentProps<any>, 'type' | 'required'> {
  fieldNameInput?: FieldNameInput
  fieldNameSelect?: FieldNameSelect
  register?: UseFormRegister<FV>
  validation?: Validate<FieldPathValue<FV, FieldNameInput>>[]
  error?: FieldError
  containerClassName?: string
  required?: boolean
  Icon?: ComponentType
  options: SelectComboItem[]
  onChange: (option: SelectComboItem, value: string | number) => void
  setValueAs?: (value: any) => any
}

export const SelectComboInput = <
  FV extends FieldValues,
  FieldNameInput extends Path<FV>,
  FieldNameSelect extends Path<FV>
>({
  fieldNameInput,
  fieldNameSelect,
  register,
  error,
  disabled,
  validation,
  children,
  containerClassName,
  className,
  required,
  Icon,
  options,
  onChange,
  setValueAs,
  ...props
}: SelectComboInputProps<FV, FieldNameInput, FieldNameSelect>) => {
  const validate = validation?.reduce(
    (a, v) => ({ ...a, [v.toString()]: v }),
    {}
  )

  const [selectedValue, setSelectedValue] = useState('')
  const [selectedOption, setSelectedOption] = useState(options[0])

  const updateValue = (value: any) => {
    console.log('updateValue', value)
    
    setSelectedValue(value as string)
    onChange(selectedOption, value)
  }

  const updateOption = (option: any) => {
    console.log('updateOption', option)
    
    setSelectedOption(option)
    onChange(option as SelectComboItem, selectedValue)
  }

  return (
    <div className={clsx(
        'flex w-full text-right bg-white rounded-lg border-2 focus-within:outline-none focus-within:ring-2 ring-gray-400 ring-offset-0 transition border-default text-lg',
        containerClassName
      )}>
      <input
        className={clsx(
          'py-[14px] px-3 w-2/3 bg-transparent border-none outline-none ring-none text-lg',
          className
        )}
        disabled={disabled}
        type="number"
        onChange={updateValue}
        {...props}
        {...register && fieldNameInput && register(fieldNameInput, {
          required: required && 'Required',
          validate,
          ...(setValueAs ? { setValueAs } : { valueAsNumber: true }),
        })}
      />
      <select
        className={clsx(
          'py-[14px] px-3 w-1/3 text-body bg-transparent focus:outline-none focus:ring-none border-default border-l-2',
        )}
        defaultValue={options[0].type}
        onSelect={updateOption}
        onChange={updateOption}
        {...props}
        {...(register &&
          fieldNameSelect &&
          register(fieldNameSelect, { required: required && 'Required', validate }))}
      >
        {options ? options.map((option: SelectComboItem, index) => (
          <option key={index} value={option.type}>{option.title}</option>
        )) : ''}
      </select>
    </div>
  )
}

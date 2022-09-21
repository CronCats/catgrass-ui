import clsx from 'clsx'
import { ComponentProps, ComponentType, ChangeEvent, useState, useEffect } from 'react'
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
  defaultValue?: string
}

export interface SelectComboInputProps<
  FV extends FieldValues,
  FieldNameInput extends Path<FV>,
  FieldNameSelect extends Path<FV>
> extends Omit<ComponentProps<any>, 'type' | 'required'> {
  name?: string
  fieldNameInput?: FieldNameInput
  fieldNameSelect?: FieldNameSelect
  register?: UseFormRegister<FV>
  validation?: Validate<FieldPathValue<FV, FieldNameInput>>[]
  error?: FieldError
  containerClassName?: string
  required?: boolean
  Icon?: ComponentType
  options: SelectComboItem[]
  // onChange: (option: SelectComboItem, value: number | string) => void
  onChange: (value: any) => any
  setValueAs?: (value: any) => any
}

export const SelectComboInput = <
  FV extends FieldValues,
  FieldNameInput extends Path<FV>,
  FieldNameSelect extends Path<FV>
>({
  name,
  fieldNameInput,
  fieldNameSelect,
  // register,
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

  console.log('onChange', onChange);
  

  const [selectedValue, setSelectedValue] = useState(options[0].defaultValue ? options[0].defaultValue : '')
  const [selectedOption, setSelectedOption] = useState(options[0])

  const updateValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log('value', value);
    
    
    setSelectedValue(value as string)
    // onChange(selectedOption, value)
  }

  // const updateOption = (e: ChangeEvent<HTMLSelectElement>) => {
  //   const v = e.target.value

  const updateOption = (e: ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value
    const item = options.filter(({ type }) => type === v)
    const option = item[0]
    
    if (option.type !== selectedOption.type && option.defaultValue) setSelectedValue(option.defaultValue as string)
    setSelectedOption(option)
    // onChange(option as SelectComboItem, option.defaultValue as string)
  }

  useEffect(() => {
    onChange({type: "hello", target: {value: {selectedValue, selectedOption}}})
  }, [selectedValue, selectedOption])

  //  const comboRegister: any = register && fieldNameInput ? register(fieldNameInput, {
  //     required: required && 'Required',
  //     validate,
  //     ...(setValueAs ? { setValueAs } : { valueAsNumber: true }),
  //   }) : {};

  //   const c = comboRegister.onChange;
  //   comboRegister.onChange = (data: ChangeEvent<HTMLInputElement>) => {
  //   console.log('onChange', data);
  //     updateValue(data);
  //     c(data);
  //   };

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
        value={selectedValue}
        // defaultValue={selectedValue}
        onChange={updateValue}
        name={fieldNameInput}
        type="text"
        {...props}
        // onChange={updateValue}
        // {...register && fieldNameInput ? ...register(fieldNameInput, {
        //   required: required && 'Required',
        //   validate,
        //   ...(setValueAs ? { setValueAs } : { valueAsNumber: true }),
        // }) : ''}

        // {...(register && fieldNameInput ? register(fieldNameInput, {
        //   required: required && 'Required',
        //   validate,
        //   ...(setValueAs ? { setValueAs } : { valueAsNumber: true }),
        // }) : {})}
        // {...comboRegister}
      />
      <select
        className={clsx(
          'py-[14px] px-3 w-1/3 text-body bg-transparent focus:outline-none focus:ring-none border-default border-l-2',
        )}
        name={fieldNameSelect}
        defaultValue={options[0].type}
        onChange={updateOption}
        {...props}
        // {...(register &&
        //   fieldNameSelect &&
        //   register(fieldNameSelect, { required: required && 'Required', validate }))}
          
      >
        {options ? options.map((option: SelectComboItem, index) => (
          <option key={index} value={option.type}>{option.title}</option>
        )) : ''}
      </select>
    </div>
  )
}

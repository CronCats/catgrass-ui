import clsx from 'clsx'
import { ChangeEvent, useEffect, useState } from 'react'
import { FieldPathValue, FieldValues, Path, Validate } from 'react-hook-form'

import { usePrevious } from '@croncat-ui/utils'

export interface ComboInputSelectValue {
  select: string
  input: string
}

export interface ComboInputSelectOption {
  key: string
  value: string
  default: string
}

export interface ComboInputSelectProps<
  FV extends FieldValues,
  FieldName extends Path<FV>
> {
  options: ComboInputSelectOption[]
  onChange: (data: ComboInputSelectValue) => void
  containerClassName?: string
  className?: string
  error?: boolean
  validation?: Validate<FieldPathValue<FV, FieldName>>[]
}

export const ComboInputSelect = <
  FV extends FieldValues,
  FieldName extends Path<FV>
>({
  options,
  onChange,
  containerClassName,
  className,
  error,
  validation,
  ...props
}: ComboInputSelectProps<FV, FieldName>) => {
  const [state, setState] = useState(() => {
    const first = options[0]
    return { input: first.default, select: first.value }
  })

  // TOOD: Finish!
  const validate = validation?.reduce(
    (a, v) => ({ ...a, [v.toString()]: v }),
    {}
  )

  const lastState = usePrevious(state)

  const updateInput = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, input: e.target.value })
  }
  const updateSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setState({ ...state, select: e.target.value })
  }

  useEffect(() => {
    if (lastState?.select !== state.select) {
      const index = options.findIndex((v) => v.value === state.select)
      setState({ ...state, input: options[index].default })
    }
    onChange(state)
  }, [state])

  return (
    <div
      className={clsx(
        'flex w-full text-lg text-right bg-white rounded-lg border-2 focus-within:outline-none focus-within:ring-2 ring-offset-0 transition border-default',
        {
          'ring-2 ring-red-700 shadow-md shadow-red-400': error,
          'ring-transparent': !error,
        },
        containerClassName
      )}
    >
      <input
        className={clsx(
          'py-[14px] px-3 w-2/3 text-lg bg-transparent border-none outline-none ring-none',
          className
        )}
        name="input"
        onChange={updateInput}
        type="text"
        value={state.input}
        {...props}
      />
      <select
        className={clsx(
          'py-[14px] px-3 w-1/3 text-body bg-transparent border-l-2 focus:outline-none focus:ring-none border-default'
        )}
        name="select"
        onChange={updateSelect}
        value={state.select}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.key}
          </option>
        ))}
      </select>
    </div>
  )
}

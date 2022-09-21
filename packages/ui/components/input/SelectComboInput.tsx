import clsx from 'clsx'
import { ChangeEvent, useEffect, useState, useRef } from 'react'
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

export interface ComboInputSelectProps {
  options: ComboInputSelectOption[]
  onChange: (data: ComboInputSelectValue) => void
  containerClassName?: string
  className?: string
}

export const ComboInputSelect = ({
  options,
  onChange,
  containerClassName,
  className,
  ...props
}: ComboInputSelectProps) => {
  const [state, setState] = useState(() => {
    const first = options[0]
    return { input: first.default, select: first.value }
  })

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
    <div className={clsx(
        'flex w-full text-right bg-white rounded-lg border-2 focus-within:outline-none focus-within:ring-2 ring-gray-400 ring-offset-0 transition border-default text-lg',
        containerClassName
      )}>
      <input
        className={clsx(
          'py-[14px] px-3 w-2/3 bg-transparent border-none outline-none ring-none text-lg',
          className
        )}
        name="input"
        type="text"
        onChange={updateInput}
        value={state.input}
        {...props}
      />
      <select
        className={clsx(
          'py-[14px] px-3 w-1/3 text-body bg-transparent focus:outline-none focus:ring-none border-default border-l-2',
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
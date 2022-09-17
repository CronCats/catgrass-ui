import { Fragment, ComponentType, useState } from 'react'
import clsx from 'clsx'
import {  } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

export interface SelectListItem {
  type: string
  title: string
  data: any
  rules?: any[]
  Icon?: ComponentType
  sort?: number
}

export interface SelectListProps {
  items: SelectListItem[]
  onSelectedItem: (item: SelectListItem) => void
}

export const SelectList = ({
  items,
  onSelectedItem,
}: SelectListProps) => {

  const [selected, setSelected] = useState(items[0])

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border-2 border-gray-200 bg-white py-3 pl-3 pr-10 text-left focus:border-gray-200 focus:outline-none focus:ring-0 focus:ring-gray-200 sm:text-sm">
              <span className="flex items-center">
                {/* <selected.icon className="h-6 w-6 flex-shrink-0" /> */}
                {selected.Icon ? (
                  <selected.Icon className="h-8 w-8 flex-shrink-0" />
                ) : ''}
                <span className="ml-3 block truncate text-lg font-bold">{selected.title}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center mr-3">
                <ChevronUpDownIcon className="h-7 w-8" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-0 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-2 ring-gray-200 focus:outline-none sm:text-sm">
                {items.map((item) => (
                  <Listbox.Option
                    key={item.sort}
                    className={({ active }) =>
                      clsx(
                        active ? 'text-gray-800 bg-gray-200' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          {item.Icon ? (
                            <item.Icon className="h-8 w-8 flex-shrink-0" />
                          ) : ''}
                          <span className="ml-3 block truncate text-lg font-bold">
                            {item.title}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={clsx(
                              active ? 'text-gray-800' : 'text-gray-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}

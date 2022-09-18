import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { ComponentType, Fragment, useState } from 'react'

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

export const SelectList = ({ items, onSelectedItem }: SelectListProps) => {
  const [selected, setSelected] = useState(items[0])

  const select = (item: SelectListItem) => {
    setSelected(item)
    onSelectedItem(item)
  }

  return (
    <Listbox onChange={select} value={selected}>
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <Listbox.Button className="relative py-3 pr-10 pl-3 w-full text-left bg-white rounded-md border-2 border-gray-200 focus:border-gray-200 focus:outline-none focus:ring-0 focus:ring-gray-200 cursor-default sm:text-sm">
              <span className="flex items-center">
                {/* <selected.icon className="h-6 w-6 flex-shrink-0" /> */}
                {selected.Icon ? (
                  <div className="flex-shrink-0 w-8 h-8">
                    <selected.Icon />
                  </div>
                ) : (
                  ''
                )}
                <span className="block ml-3 text-lg font-bold truncate">
                  {selected.title}
                </span>
              </span>
              <span className="flex absolute inset-y-0 right-0 items-center mr-3 pointer-events-none">
                <ChevronUpDownIcon aria-hidden="true" className="w-8 h-7" />
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              show={open}
            >
              <Listbox.Options className="overflow-auto absolute z-10 py-1 mt-0 w-full max-h-56 text-base bg-white rounded-md focus:outline-none ring-2 ring-gray-200 shadow-lg sm:text-sm">
                {items.map((item) => (
                  <Listbox.Option
                    key={item.sort}
                    className={({ active }) =>
                      clsx(
                        active ? 'text-gray-800 bg-gray-200' : 'text-gray-900',
                        'relative py-2 pr-9 pl-3 cursor-default select-none'
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          {item.Icon ? (
                            <div className="flex-shrink-0 w-8 h-8">
                              <item.Icon />
                            </div>
                          ) : (
                            ''
                          )}
                          <span className="block ml-3 text-lg font-bold truncate">
                            {item.title}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={clsx(
                              active ? 'text-gray-800' : 'text-gray-600',
                              'flex absolute inset-y-0 right-0 items-center pr-4'
                            )}
                          >
                            <CheckIcon aria-hidden="true" className="w-5 h-5" />
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

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState } from 'react'

import { Action } from '@croncat-ui/actions'

export interface ActionSelectorProps {
  actions: Action[]
  onSelectedAction: (action: Action) => void
}

export const ActionSelector = ({
  actions,
  onSelectedAction,
}: ActionSelectorProps) => {
  const [toggleActive, setToggleActive] = useState(false)
  const [selectedAction, setSelectedAction] = useState(actions[0])

  const toggleList = () => {
    setToggleActive(!toggleActive)
  }

  const selectAction = (action: Action) => {
    setSelectedAction(action)
    onSelectedAction(action)
    toggleList()
  }

  return (
    <div>
      <div className="relative">
        <div
          className="flex z-10 p-4 text-gray-100 bg-gray-800 rounded-lg"
          onClick={toggleList}
        >
          <ActionItem action={selectedAction} />

          <div className="flex my-auto w-6">
            {toggleActive ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </div>
        </div>

        <div
          className={clsx(
            'absolute top-12 -right-1 -left-1 z-20 flex-col p-2 text-gray-100 bg-gray-500 rounded-lg shadow-lg',
            {
              visible: toggleActive === true,
              invisible: toggleActive === false,
            }
          )}
        >
          {actions.map((action, index) => (
            <div
              key={index}
              className="p-1 hover:bg-gray-800 active:bg-gray-800 rounded-lg"
              onClick={() => {
                selectAction(action)
              }}
            >
              <ActionItem action={action} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export interface ActionItemProps {
  action: Action
}

export const ActionItem = ({
  action: { title, subtitle, Icon },
}: ActionItemProps) => (
  <div className="flex px-2 w-full cursor-pointer">
    <div className="flex py-2 mr-4 w-8">
      <Icon />
    </div>
    <div className="flex-col py-2 m-auto w-full">
      <h3 className="text-lg font-bold leading-4">{title}</h3>
      <small className="text-xs text-gray-400">{subtitle}</small>
    </div>
  </div>
)

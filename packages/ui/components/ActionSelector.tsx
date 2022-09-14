import clsx from 'clsx'
import { useState } from 'react'
import {
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'

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
    toggleList()
    setSelectedAction(action)
    onSelectedAction(action)
  }

  return (
    <div>
      <div className="relative">
        <div onClick={toggleList} className="flex z-10 p-4 rounded-lg bg-gray-800 text-gray-100">
          <ActionItem action={selectedAction} />

          <div className="flex my-auto w-6">
            {toggleActive ? (
              <ChevronUpIcon />
            ) : (
              <ChevronDownIcon />
            )}
          </div>
        </div>

        <div className={clsx(
          "flex-col absolute top-12 -right-1 -left-1 z-20 p-2 shadow-lg rounded-lg bg-gray-500 text-gray-100",
          {
            visible: toggleActive === true,
            invisible: toggleActive === false,
          }
        )}>
          {actions.map((action, index) => (
            <div key={index} className="rounded-lg hover:bg-gray-800 active:bg-gray-800 p-1" onClick={() => {selectAction(action)}}>
              <ActionItem action={action} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ActionItemProps {
  action: Action
}

const ActionItem = ({
  action: { title, subtitle, Icon },
}: ActionItemProps) => (
  <div className="flex px-2 cursor-pointer w-full">
    <div className="flex py-2 mr-4 w-8">
      <Icon />
    </div>
    <div className="flex-col py-2 m-auto w-full">
      <h3 className="text-lg font-bold leading-4">
        {title}
      </h3>
      <small className="text-xs text-gray-400">
        {subtitle}
      </small>
    </div>
  </div>
)

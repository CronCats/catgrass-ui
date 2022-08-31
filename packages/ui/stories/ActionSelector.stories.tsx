import { ComponentMeta, ComponentStory } from '@storybook/react'

import { useActions } from '@croncat-ui/actions'

import { ActionSelector } from 'components/ActionSelector'

export default {
  title: 'Croncat UI / ActionSelector',
  component: ActionSelector,
} as ComponentMeta<typeof ActionSelector>

const Template: ComponentStory<typeof ActionSelector> = (args) => {
  const actions = useActions()

  return <ActionSelector {...args} actions={actions} />
}

export const Default = Template.bind({})
Default.args = {}

// TODO: Fix story.

import { ComponentMeta, ComponentStory } from '@storybook/react'

import { NetworkAccountSelector } from 'components/NetworkAccountSelector'

export default {
  title: 'Croncat UI / NetworkAccountSelector',
  component: NetworkAccountSelector,
} as ComponentMeta<typeof NetworkAccountSelector>

const Template: ComponentStory<typeof NetworkAccountSelector> = (args) => (
  <NetworkAccountSelector {...args} />
)

export const Default = Template.bind({})
Default.args = {
  accountNetworks: null, // TODO: Fill in default value.
  onConnectAccount: null, // TODO: Fill in default value.
}

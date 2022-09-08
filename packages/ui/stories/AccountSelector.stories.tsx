import { ComponentMeta, ComponentStory } from '@storybook/react'

import { AccountSelector } from 'components/AccountSelector'

export default {
  title: 'Croncat UI / AccountSelector',
  component: AccountSelector,
} as ComponentMeta<typeof AccountSelector>

const Template: ComponentStory<typeof AccountSelector> = (args) => (
  <AccountSelector {...args} />
)

export const Default = Template.bind({})
Default.args = {
  "accountNetworks": null, // TODO: Fill in default value.
  "onConnectAccount": null, // TODO: Fill in default value.
}

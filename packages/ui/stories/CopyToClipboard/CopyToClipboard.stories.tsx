import { ComponentMeta, ComponentStory } from '@storybook/react'

import { CopyToClipboard } from 'components/CopyToClipboard'

export default {
  title: 'Croncat UI / CopyToClipboard',
  component: CopyToClipboard,
} as ComponentMeta<typeof CopyToClipboard>

const Template: ComponentStory<typeof CopyToClipboard> = (args) => (
  <CopyToClipboard {...args} />
)

export const Default = Template.bind({})
Default.args = {
  value: null, // TODO: Fill in default value.
}
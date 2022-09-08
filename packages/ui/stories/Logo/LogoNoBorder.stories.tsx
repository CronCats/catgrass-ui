import { ComponentMeta, ComponentStory } from '@storybook/react'

import { LogoNoBorder } from 'components/Logo'

export default {
  title: 'Croncat UI / LogoNoBorder',
  component: LogoNoBorder,
} as ComponentMeta<typeof LogoNoBorder>

const Template: ComponentStory<typeof LogoNoBorder> = (args) => (
  <LogoNoBorder {...args} />
)

export const Default = Template.bind({})
Default.args = {}

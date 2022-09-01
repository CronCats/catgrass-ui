import { ChartPieIcon } from '@heroicons/react/24/outline'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { NavItem } from 'components/NavItem'

export default {
  title: 'Croncat UI / NavItem',
  component: NavItem,
} as ComponentMeta<typeof NavItem>

const Template: ComponentStory<typeof NavItem> = (args) => <NavItem {...args} />

export const Default = Template.bind({})
Default.args = {
  item: {
    renderIcon: (color, mobile) => (
      <ChartPieIcon
        color={color}
        height={mobile ? 16 : 14}
        width={mobile ? 16 : 14}
      />
    ),
    label: 'Stake',
    href: '/',
    active: false,
    external: false,
  },
}

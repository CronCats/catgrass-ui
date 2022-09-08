import { ComponentMeta, ComponentStory } from '@storybook/react'

import { NoMobileWallet } from 'components/MobileWalletConnect'

export default {
  title: 'Croncat UI / NoMobileWallet',
  component: NoMobileWallet,
} as ComponentMeta<typeof NoMobileWallet>

const Template: ComponentStory<typeof NoMobileWallet> = (_args) => (
  <NoMobileWallet />
)

export const Default = Template.bind({})
Default.args = {}

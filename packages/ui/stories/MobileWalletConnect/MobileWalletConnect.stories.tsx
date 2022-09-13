import { ComponentMeta, ComponentStory } from '@storybook/react'

import { MobileWalletConnect } from 'components/MobileWalletConnect'

export default {
  title: 'Croncat UI / MobileWalletConnect',
  component: MobileWalletConnect,
} as ComponentMeta<typeof MobileWalletConnect>

const Template: ComponentStory<typeof MobileWalletConnect> = (args) => (
  <MobileWalletConnect {...args} />
)

export const Default = Template.bind({})
Default.args = {
  connected: null, // TODO: Fill in default value.
  walletBalanceDenom: null, // TODO: Fill in default value.
  onConnect: null, // TODO: Fill in default value.
}

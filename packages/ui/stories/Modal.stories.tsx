import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Modal } from 'components/Modal'

export default {
  title: 'Croncat UI / Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Some content',
}

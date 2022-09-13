import { ComponentMeta, ComponentStory } from '@storybook/react'

import { FormattedJSONDisplay } from 'components/FormattedJSONDisplay'

export default {
  title: 'Croncat UI / FormattedJSONDisplay',
  component: FormattedJSONDisplay,
} as ComponentMeta<typeof FormattedJSONDisplay>

const Template: ComponentStory<typeof FormattedJSONDisplay> = (args) => (
  <FormattedJSONDisplay {...args} />
)

export const Default = Template.bind({})
Default.args = {
  jsonLoadable: null, // TODO: Fill in default value.
}

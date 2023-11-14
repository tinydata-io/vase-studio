import type { Meta, StoryObj } from "@storybook/react";

import { About } from ".";

const meta: Meta<typeof About> = {
  component: About,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof About>;

export const AboutSample: Story = {};

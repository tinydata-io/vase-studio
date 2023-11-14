import type { Meta, StoryObj } from "@storybook/react";

import { Footer } from ".";

const meta: Meta<typeof Footer> = {
  component: Footer,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const FooterSample: Story = {};

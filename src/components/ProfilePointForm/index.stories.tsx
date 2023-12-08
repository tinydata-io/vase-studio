import type { Meta, StoryObj } from "@storybook/react";

import { ProfilePointForm } from ".";

const meta: Meta<typeof ProfilePointForm> = {
  component: ProfilePointForm,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ProfilePointForm>;

export const ProfilePointFormSample: Story = {};

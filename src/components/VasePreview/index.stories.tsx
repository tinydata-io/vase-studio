import type { Meta, StoryObj } from "@storybook/react";

import { VasePreview } from ".";
import { SampleA } from "@/examples/vase";

const meta: Meta<typeof VasePreview> = {
  component: VasePreview,
  parameters: { layout: "full" },
};

export default meta;
type Story = StoryObj<typeof VasePreview>;

export const VasePreviewSample: Story = {
  args: {
    vase: SampleA,
  },
  render: ({ ...args }) => {
    return <VasePreview {...args} />;
  },
};

import type { Meta, StoryObj } from "@storybook/react";

import { VasePreview } from ".";
import { SizeUnit } from "@/lib/units";
import { samplePoints } from "./samplePoints";

const meta: Meta<typeof VasePreview> = {
  component: VasePreview,
  parameters: { layout: "full" },
};

export default meta;
type Story = StoryObj<typeof VasePreview>;

export const VasePreviewSample: Story = {
  args: {
    unit: SizeUnit.Centimeter,
    height: 10,
    profilePoints: samplePoints,
    rotations: 0.2,
  },
  render: ({ ...args }) => {
    return <VasePreview {...args} />;
  },
};

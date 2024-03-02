import type { Meta, StoryObj } from "@storybook/react";

import { SimpleProfile } from ".";
import { SizeUnit } from "@/lib/units";

const meta: Meta<typeof SimpleProfile> = {
  component: SimpleProfile,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof SimpleProfile>;

export const SimpleProfileSample: Story = {
  args: {
    width: 512,
    height: 512,
    profileDiameter: 8,
    colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"],
    sizeUnit: SizeUnit.Centimeter,
  },
  render: ({ ...args }) => {
    const profile = {
      sections: 4,
      pointSets: [
        {
          offset: 0,
          count: 4,
          angleStart: 0,
          angleStep: 0.25,
        },
        {
          offset: 0.5,
          count: 4,
          angleStart: 0.125,
          angleStep: 0.25,
        },
        {
          offset: -0.25,
          count: 2,
          angleStart: 0.4,
          angleStep: 0.2,
        },
      ],
    };

    return <SimpleProfile {...args} profile={profile} />;
  },
};

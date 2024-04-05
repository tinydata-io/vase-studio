import type { Meta, StoryObj } from "@storybook/react";

import { SimpleProfile } from ".";
import { SizeUnit } from "@/lib/units";
import { DefaultPalette } from "@/lib/colors";

const meta: Meta<typeof SimpleProfile> = {
  component: SimpleProfile,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof SimpleProfile>;

export const SimpleProfileDemo: Story = {
  args: {
    width: 512,
    height: 512,
    profileDiameter: 8,
    colors: DefaultPalette,
    sizeUnit: SizeUnit.Centimeter,
    debugPoints: false,
  },
  render: ({ ...args }) => {
    const profile = {
      sections: 4,
      pointSets: [
        {
          offset: {
            value: 0,
          },
          count: 4,
          angleStart: 0,
          angleStep: 0.25,
        },
        {
          offset: {
            value: 0.5,
            weightIn: 1,
            weightOut: 1,
          },
          count: 4,
          angleStart: 0.125,
          angleStep: 0.25,
        },
        {
          offset: {
            value: -0.25,
          },
          count: 2,
          angleStart: 0.4,
          angleStep: 0.2,
        },
      ],
    };

    return <SimpleProfile {...args} profile={profile} />;
  },
};

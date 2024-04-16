import type { Meta, StoryObj } from "@storybook/react";

import { SimpleProfile } from ".";
import { SizeUnit } from "@/lib/units";
import { DefaultPalette } from "@/lib/colors";

import { getExample } from "@/examples/vase";

const meta: Meta<typeof SimpleProfile> = {
  component: SimpleProfile,
  parameters: {
    layout: "centered",
    controls: { exclude: ["width", "height", "colors", "profile"] },
  },
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
    intensity: 1,
  },
  argTypes: {
    profileDiameter: {
      control: {
        type: "range",
        min: 1,
        max: 16,
        step: 1,
      },
    },
    intensity: {
      control: {
        type: "range",
        min: 0,
        max: 1,
        step: 0.05,
      },
    },
  },
  render: (args, { globals: { example } }) => {
    const vase = getExample(example);
    const profile = vase.profile;

    return <SimpleProfile {...args} profile={profile} />;
  },
};

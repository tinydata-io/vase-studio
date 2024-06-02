import type { Meta, StoryObj } from "@storybook/react";

import { SizeUnit } from "@/lib/units";

import { getRotation, getRadius, getIntensity } from "@/lib/vase/slices";

import { getExample } from "@/examples/vase";
import { SideProfile } from "./SideProfile";

const meta: Meta<typeof SideProfile> = {
  component: SideProfile,
  parameters: {
    layout: "centered",
    controls: { exclude: ["deconstructor", "sliceProperty", "slices"] },
  },
  render: (args, { globals: { example } }) => {
    const vase = getExample(example);
    return <SideProfile {...args} vase={vase} />;
  },
  argTypes: {
    height: {
      control: {
        type: "range",
        min: 5,
        max: 20,
        step: 1,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SideProfile>;

export const Radius: Story = {
  args: {
    sizeUnit: SizeUnit.Centimeter,
    height: 10,
    deconstructor: getRadius,
  },
};

export const Rotation: Story = {
  args: {
    sizeUnit: SizeUnit.Centimeter,
    height: 10,
    deconstructor: getRotation,
  },
};

export const Intensity: Story = {
  args: {
    sizeUnit: SizeUnit.Centimeter,
    height: 10,
    deconstructor: getIntensity,
  },
};

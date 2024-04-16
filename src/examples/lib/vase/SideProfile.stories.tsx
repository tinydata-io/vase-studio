import type { Meta, StoryObj } from "@storybook/react";

import { SizeUnit } from "@/lib/units";

import { getRotation, getRadius, getIntensity } from "@/lib/vase/slices";

import { getExample, Example } from "@/examples/vase";
import { SideProfile, SideProfileProps } from "./SideProfile";

const meta: Meta<typeof SideProfile> = {
  component: SideProfile,
  parameters: {
    layout: "centered",
    controls: { exclude: ["deconstructor", "sliceProperty", "slices"] },
  },
  render: (args, { globals: { example } }) => {
    const vase = getExample(example);
    return <SideProfile {...args} slices={vase.slices} />;
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
    sliceProperty: "radius",
  },
};

export const Rotation: Story = {
  args: {
    sizeUnit: SizeUnit.Centimeter,
    height: 10,
    deconstructor: getRotation,
    sliceProperty: "rotation",
  },
};

export const Intensity: Story = {
  args: {
    sizeUnit: SizeUnit.Centimeter,
    height: 10,
    deconstructor: getIntensity,
    sliceProperty: "intensity",
  },
};

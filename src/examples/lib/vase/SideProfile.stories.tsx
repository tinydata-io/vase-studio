import type { Meta, StoryObj } from "@storybook/react";

import { Vec2 } from "@/lib/math2d";
import { SizeUnit } from "@/lib/units";

import { Curve } from "@/components/svg";
import { getRotation, getRadius, getIntensity } from "@/lib/vase/slices";

import { getExample, Example } from "@/examples/vase";
import { SideProfile, SideProfileProps } from "./SideProfile";

export type SideProfileStoryProps = SideProfileProps & { example: Example };

const meta: Meta<SideProfileStoryProps> = {
  component: SideProfile,
  parameters: {
    layout: "centered",
    controls: { exclude: ["deconstructor", "sliceProperty", "slices"] },
  },
  render: ({ ...args }) => {
    const example = getExample(args.example);
    return <SideProfile {...args} slices={example.slices} />;
  },
  argTypes: {
    example: {
      control: "select",
      options: Object.values(Example),
    },
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
type Story = StoryObj<SideProfileStoryProps>;

export const Radius: Story = {
  args: {
    example: Example.SampleVase,
    sizeUnit: SizeUnit.Centimeter,
    height: 10,
    deconstructor: getRadius,
    sliceProperty: "radius",
  },
};

export const Rotation: Story = {
  args: {
    example: Example.SampleVase,
    sizeUnit: SizeUnit.Centimeter,
    height: 10,
    deconstructor: getRotation,
    sliceProperty: "rotation",
  },
};

export const Intensity: Story = {
  args: {
    example: Example.SampleVase,
    sizeUnit: SizeUnit.Centimeter,
    height: 10,
    deconstructor: getIntensity,
    sliceProperty: "intensity",
  },
};

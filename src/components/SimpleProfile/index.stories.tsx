import type { Meta, StoryObj } from "@storybook/react";

import { SimpleProfile, SimpleProfileProps } from ".";
import { SizeUnit } from "@/lib/units";
import { DefaultPalette } from "@/lib/colors";

import { getExample, Example } from "@/examples/vase";

type SimpleProfileStoryProps = SimpleProfileProps & { example: Example };

const meta: Meta<SimpleProfileStoryProps> = {
  component: SimpleProfile,
  parameters: {
    layout: "centered",
    controls: { exclude: ["width", "height", "colors", "profile"] },
  },
};

export default meta;
type Story = StoryObj<SimpleProfileStoryProps>;

export const SimpleProfileDemo: Story = {
  args: {
    example: Example.SampleVase,
    width: 512,
    height: 512,
    profileDiameter: 8,
    colors: DefaultPalette,
    sizeUnit: SizeUnit.Centimeter,
    debugPoints: false,
    intensity: 1,
  },
  argTypes: {
    example: {
      control: "select",
      options: Object.values(Example),
    },
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
  render: ({ ...args }) => {
    const example = getExample(args.example as Example);
    const profile = example.profile;

    return <SimpleProfile {...args} profile={profile} />;
  },
};

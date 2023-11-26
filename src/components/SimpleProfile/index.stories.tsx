import type { Meta, StoryObj } from "@storybook/react";

import { PointSet } from "./types";
import { SimpleProfile } from ".";

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
    sections: 4,
    profileDiameter: 80,
  },
  render: ({ ...args }) => {
    const pointSets: PointSet[] = [
      {
        offset: 0,
        count: 4,
        angleStart: 0,
        angleStep: 0.25,
        color: "red",
      },
      {
        offset: 5,
        count: 4,
        angleStart: 0.125,
        angleStep: 0.25,
        color: "blue",
      },
      {
        offset: -5,
        count: 2,
        angleStart: 0.4,
        angleStep: 0.2,
        color: "green",
      },
    ];

    return <SimpleProfile {...args} pointSets={pointSets} />;
  },
};

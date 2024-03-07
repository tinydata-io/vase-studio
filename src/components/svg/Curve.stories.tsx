import type { Meta, StoryObj } from "@storybook/react";

import { Curve } from "./Curve";

const meta: Meta<typeof Curve> = {
  component: Curve,
  parameters: { layout: "centered" },
  render: ({ ...args }) => {
    return (
      <svg viewBox="-5,-5,205,205" width={256} height={256}>
        <Curve {...args} />
      </svg>
    );
  },
};

export default meta;
type Story = StoryObj<typeof Curve>;

export const OpenCurve: Story = {
  args: {
    strokeWidth: 2,
    curvePoints: [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { x: 200, y: 0 },
    ],
  },
};

export const ClosedCurve: Story = {
  args: {
    strokeWidth: 2,
    closed: true,
    curvePoints: [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { x: 200, y: 0 },
    ],
  },
};

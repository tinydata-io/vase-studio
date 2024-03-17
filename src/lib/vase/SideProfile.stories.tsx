import type { Meta, StoryObj } from "@storybook/react";

import { Vec2 } from "@/lib/math2d";
import { VaseProfile, VaseSlice } from "@/lib/types";

import { Curve } from "@/components/svg";
import { getSideProfile } from "./slices";
import { SizeUnit } from "../units";

type SideProfileProps = {
  slices: VaseSlice[];
  height: number;
  sizeUnit: SizeUnit;
};

const SideProfile = ({ slices, height, sizeUnit }: SideProfileProps) => {
  const sideProfile: Vec2[] = getSideProfile(slices, height, sizeUnit).map(
    (point) => ({
      x: point.x,
      y: height - point.y,
    })
  );

  return (
    <svg viewBox={`-1,-1,${height + 2},${height + 2}`} width={512} height={512}>
      {slices.map((slice, i) => (
        <circle
          key={i}
          cy={height - slice.position * height}
          cx={slice.radius.value}
          r={0.2}
          fill="red"
        />
      ))}
      <Curve curvePoints={sideProfile} strokeWidth={0.05} />
      {sideProfile.map((p, i) => (
        <circle key={i} cy={p.y} cx={p.x} r={0.075} fill="black" />
      ))}
      <polyline
        points={`0 ${height} 0 0`}
        fill="none"
        stroke="black"
        strokeDasharray="0.1, 0.1"
        strokeWidth={0.05}
      />
    </svg>
  );
};

const meta: Meta<typeof SideProfile> = {
  component: SideProfile,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof SideProfile>;

export const SimpleSegment: Story = {
  args: {
    slices: [
      {
        position: 0,
        radius: { value: 3, weightIn: 1, weightOut: 1 },
        rotation: { value: 0 },
      },
      {
        position: 0.1,
        radius: { value: 5, weightIn: 1, weightOut: 1 },
        rotation: { value: 0 },
      },
      {
        position: 0.4,
        radius: { value: 5, weightIn: 0.5, weightOut: 0 },
        rotation: { value: 0 },
      },
      {
        position: 0.8,
        radius: { value: 2 },
        rotation: { value: 0 },
      },
      {
        position: 1.0,
        radius: { value: 3 },
        rotation: { value: 0 },
      },
    ],
    sizeUnit: SizeUnit.Centimeter,
    height: 10,
  },
};

import type { Meta, StoryObj } from "@storybook/react";

import { Vec2 } from "@/lib/math2d";
import { VaseProfile, VaseSlice } from "@/lib/types";

import { Curve } from "@/components/svg";
import { getRotation, getRadius, getIntensity } from "./slices";
import { SizeUnit } from "../units";

type SideProfileProps = {
  slices: VaseSlice[];
  height: number;
  sizeUnit: SizeUnit;
  deconstructor: typeof getRadius;
  sliceProperty: "radius" | "rotation" | "intensity";
};

const SideProfile = ({
  slices,
  height,
  sizeUnit,
  deconstructor,
  sliceProperty,
}: SideProfileProps) => {
  const deconstructedProfile: Vec2[] = deconstructor(
    slices,
    height,
    sizeUnit
  ).map((point) => ({
    x: point.x,
    y: height - point.y,
  }));

  const width = height;
  const margin = 0.1 * height;

  const vbL = -margin;
  const vbT = -margin;
  const vbW = width + 2 * margin;
  const vbH = height + 2 * margin;

  return (
    <svg
      viewBox={`${vbL} ${vbT} ${vbW} ${vbH}`}
      width={512}
      height={512}
      style={{ border: "1px solid black" }}
    >
      {slices.map(
        (slice, i) =>
          slice[sliceProperty] && (
            <circle
              key={i}
              cy={height - slice.position * height}
              cx={slice[sliceProperty]!.value}
              r={0.2}
              fill="red"
            />
          )
      )}

      <Curve curvePoints={deconstructedProfile} strokeWidth={0.05} />

      {deconstructedProfile.map((p, i) => (
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

const SampleSlices = [
  {
    position: 0,
    radius: { value: 3, weightIn: 1, weightOut: 1 },
    rotation: { value: 0 },
    intensity: { value: 0 },
  },
  {
    position: 0.1,
    radius: { value: 5, weightIn: 1, weightOut: 1 },
    rotation: { value: 1 },
    intensity: { value: 1 },
  },
  {
    position: 0.4,
    radius: { value: 5, weightIn: 0.5, weightOut: 0 },
  },
  {
    position: 0.6,
  },
  {
    position: 0.7,
    intensity: { value: 1 },
  },
  {
    position: 0.8,
    radius: { value: 2 },
  },
  {
    position: 0.9,
    rotation: { value: 2 },
  },
  {
    position: 1.0,
    radius: { value: 3, weightIn: 0, weightOut: 1 },
    rotation: { value: 3 },
    intensity: { value: 0 },
  },
];

export const Radius: Story = {
  args: {
    slices: SampleSlices,
    sizeUnit: SizeUnit.Centimeter,
    height: 10,
    deconstructor: getRadius,
    sliceProperty: "radius",
  },
};

export const Rotation: Story = {
  args: {
    slices: SampleSlices,
    sizeUnit: SizeUnit.Centimeter,
    height: 10,
    deconstructor: getRotation,
    sliceProperty: "rotation",
  },
};

export const Intensity: Story = {
  args: {
    slices: SampleSlices,
    sizeUnit: SizeUnit.Centimeter,
    height: 10,
    deconstructor: getIntensity,
    sliceProperty: "intensity",
  },
};

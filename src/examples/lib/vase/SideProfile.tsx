import type { Meta, StoryObj } from "@storybook/react";

import { Vec2 } from "@/lib/math2d";
import { VaseSlice } from "@/lib/types";
import { SizeUnit } from "@/lib/units";

import { Curve } from "@/components/svg";
import { Deconstructor } from "@/lib/vase/slices";

export type SideProfileProps = {
  slices: VaseSlice[];
  height: number;
  sizeUnit: SizeUnit;
  yStep?: number;
  deconstructor: Deconstructor;
  sliceProperty: "radius" | "rotation" | "intensity";
};

export const SideProfile = ({
  slices,
  height,
  sizeUnit,
  yStep,
  deconstructor,
  sliceProperty,
}: SideProfileProps) => {
  const deconstructedProfile: Vec2[] = deconstructor(
    slices,
    height,
    sizeUnit,
    yStep
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

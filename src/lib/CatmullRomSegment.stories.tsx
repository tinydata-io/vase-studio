import type { Meta, StoryObj } from "@storybook/react";
import {
  Vec2,
  catmullRomCurvePoint,
  estimateCatmullRomCurveLength,
  simplifyProfilePoints,
} from "./math2d";

import { Curve } from "@/components/svg";

type CatmullRomSegmentProps = {
  p0: Vec2;
  p1: Vec2;
  p2: Vec2;
  p3: Vec2;
  weightStart: number;
  weightEnd: number;
};

const CatmullRomSegment = ({
  p0,
  p1,
  p2,
  p3,
  weightStart,
  weightEnd,
}: CatmullRomSegmentProps) => {
  const minDistance = 1;

  const estimatedSegmentLength = estimateCatmullRomCurveLength(
    p0,
    p1,
    p2,
    p3,
    weightStart,
    weightEnd,
    minDistance
  );

  const steps = Math.ceil(estimatedSegmentLength / minDistance);
  const step = 1 / steps;

  let points: Vec2[] = [p1];

  for (let j = 1; j < steps; j++) {
    const t = j * step;
    let point = catmullRomCurvePoint(p0, p1, p2, p3, weightStart, weightEnd, t);
    points.push(point);
  }

  points = simplifyProfilePoints(points, 0.5);

  return (
    <svg viewBox="-5,-5,255,255" width={256} height={256}>
      <circle cx={p0.x} cy={p0.y} r={4} fill="red" />
      <circle cx={p1.x} cy={p1.y} r={4} fill="green" />
      <circle cx={p2.x} cy={p2.y} r={4} fill="blue" />
      <circle cx={p3.x} cy={p3.y} r={4} fill="orange" />
      <Curve curvePoints={points} strokeWidth={2} />
    </svg>
  );
};

const meta: Meta<typeof CatmullRomSegment> = {
  component: CatmullRomSegment,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof CatmullRomSegment>;

export const SimpleSegment: Story = {
  args: {
    p0: { x: 10, y: 50 },
    p1: { x: 50, y: 125 },
    p2: { x: 200, y: 125 },
    p3: { x: 240, y: 200 },
    weightStart: 0,
    weightEnd: 0,
  },
};

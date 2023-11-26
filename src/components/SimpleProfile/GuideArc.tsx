import { pointOnCircle } from "@/lib/math2d";

import { DrawProps } from "./types";

export const FIVE_DEGREES = (Math.PI * 2) / 72;

export const GuideArc = ({
  profileRadius,
  angleStart,
  angleStep,
  strokeWidth,
}: DrawProps) => {
  const arcStroke = {
    strokeWidth: strokeWidth,
    stroke: "#000000",
    fill: "none",
  };

  const arcStartAngle = angleStart;
  const arcEndAngle = arcStartAngle + angleStep;
  const arcRadius = profileRadius / 2;

  const arcStart = pointOnCircle(arcRadius, arcStartAngle);
  const arcEnd = pointOnCircle(arcRadius, arcEndAngle);
  const arcCapSize = strokeWidth * 4;
  const arcCapAngleLength = Math.min(angleStep / 4, FIVE_DEGREES);

  const arcStartCap = [
    pointOnCircle(arcRadius + arcCapSize, arcStartAngle + arcCapAngleLength),
    pointOnCircle(arcRadius - arcCapSize, arcStartAngle + arcCapAngleLength),
  ];

  const arcEndCap = [
    pointOnCircle(arcRadius + arcCapSize, arcEndAngle - arcCapAngleLength),
    pointOnCircle(arcRadius - arcCapSize, arcEndAngle - arcCapAngleLength),
  ];

  return (
    <path
      d={`
        M ${arcStart.x} ${arcStart.y} A ${arcRadius} ${arcRadius} 0 0 1 ${arcEnd.x} ${arcEnd.y}

        M ${arcStartCap[0].x} ${arcStartCap[0].y}
        L ${arcStart.x} ${arcStart.y}
        L ${arcStartCap[1].x} ${arcStartCap[1].y}

        M ${arcEndCap[0].x} ${arcEndCap[0].y}
        L ${arcEnd.x} ${arcEnd.y}
        L ${arcEndCap[1].x} ${arcEndCap[1].y}
      `}
      {...arcStroke}
    />
  );
};

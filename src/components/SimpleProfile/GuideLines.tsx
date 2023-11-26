import { pointOnCircle } from "@/lib/math2d";

import { DrawProps } from "./types";

export const GuideLines = ({
  profileRadius,
  sections,
  angleStart,
  angleStep,
  strokeWidth,
}: DrawProps) => {
  const dashedStroke = {
    strokeWidth: strokeWidth,
    stroke: "#AAAAAA",
    strokeDasharray: `${strokeWidth * 4} ${strokeWidth * 4}`,
    fill: "none",
  };

  const sectionLineEndPoints = [];

  for (let i = 0; i < sections; i++) {
    const angle = angleStart + angleStep * i;
    const p = pointOnCircle(profileRadius, angle);
    sectionLineEndPoints.push(p);
  }

  const arcStartAngle = angleStart;
  const arcEndAngle = arcStartAngle + angleStep;
  const arcRadius = profileRadius / 2;

  const arcStart = pointOnCircle(arcRadius, arcStartAngle);
  const arcEnd = pointOnCircle(arcRadius, arcEndAngle);

  return (
    <>
      <circle cx={0} cy={0} r={profileRadius} {...dashedStroke} />

      <path
        d={`M ${arcStart.x} ${arcStart.y} A ${arcRadius} ${arcRadius} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
        {...dashedStroke}
      />

      {sectionLineEndPoints.map((p, i) => (
        <line key={i} x1={0} y1={0} x2={p.x} y2={p.y} {...dashedStroke} />
      ))}
    </>
  );
};

import { DrawProps, pointOnCircle } from "./util";

export const FiveDegrees = (Math.PI * 2) / 72;

export const GuideArc = (props: DrawProps) => {
  const arcStroke = {
    strokeWidth: props.strokeWidth,
    stroke: "#000000",
    fill: "none",
  };

  const arcStartAngle = props.angleStart;
  const arcEndAngle = arcStartAngle + props.angleStep;
  const arcRadius = props.profileRadius / 2;

  const arcStart = pointOnCircle(arcRadius, arcStartAngle);
  const arcEnd = pointOnCircle(arcRadius, arcEndAngle);
  const arcCapSize = props.strokeWidth * 4;
  const arcCapAngleLength = Math.min(props.angleStep / 4, FiveDegrees);

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

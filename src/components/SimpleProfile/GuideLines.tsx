import { DrawProps, pointOnCircle } from "./util";

export const GuideLines = (props: DrawProps) => {
  const dashedStroke = {
    strokeWidth: props.strokeWidth,
    stroke: "#AAAAAA",
    strokeDasharray: `${props.strokeWidth * 4} ${props.strokeWidth * 4}`,
    fill: "none",
  };

  const sectionLineEndPoints = [];

  for (let i = 0; i < props.sections; i++) {
    const angle = props.angleStart + props.angleStep * i;
    const p = pointOnCircle(props.profileRadius, angle);
    sectionLineEndPoints.push(p);
  }

  const arcStartAngle = props.angleStart;
  const arcEndAngle = arcStartAngle + props.angleStep;
  const arcRadius = props.profileRadius / 2;

  const arcStart = pointOnCircle(arcRadius, arcStartAngle);
  const arcEnd = pointOnCircle(arcRadius, arcEndAngle);

  return (
    <>
      <circle cx={0} cy={0} r={props.profileRadius} {...dashedStroke} />

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

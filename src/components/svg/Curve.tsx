import { Vec2 } from "@/lib/math2d";
import { Color } from "@/lib/types";

type CurveProps = {
  curvePoints: Vec2[];
  strokeWidth: number;
  strokeColor?: Color;
  closed?: boolean;
};

export const Curve = ({
  curvePoints,
  strokeWidth,
  strokeColor,
  closed,
}: CurveProps) => {
  let points = curvePoints.map((p) => `${p.x},${p.y}`).join(" ");

  if (closed === true) {
    points += ` ${curvePoints[0].x},${curvePoints[0].y}`;
  }

  return (
    <polyline
      points={points}
      stroke={strokeColor || "#000"}
      fill="none"
      strokeWidth={strokeWidth}
    />
  );
};

import { Vec2 } from "@/lib/math2d";

import { DrawProps } from "./types";

type ProfileCurveProps = DrawProps & {
  profileCurve: Vec2[];
};

export const ProfileCurve = ({
  profileCurve,
  strokeWidth,
}: ProfileCurveProps) => {
  const points =
    profileCurve.map((p) => `${p.x},${p.y}`).join(" ") +
    ` ${profileCurve[0].x},${profileCurve[0].y}`; // close curve

  return (
    <polyline
      points={points}
      stroke="black"
      fill="none"
      strokeWidth={strokeWidth}
    />
  );
};

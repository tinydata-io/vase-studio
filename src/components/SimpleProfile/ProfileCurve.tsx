import { DrawProps, Vec2 } from "./util";

type ProfileCurveProps = DrawProps & {
  profileCurve: Vec2[];
};

export const ProfileCurve = ({
  profileCurve,
  strokeWidth,
}: ProfileCurveProps) => {
  const points = profileCurve.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <polyline
      points={points}
      stroke="black"
      fill="none"
      strokeWidth={strokeWidth}
    />
  );
};

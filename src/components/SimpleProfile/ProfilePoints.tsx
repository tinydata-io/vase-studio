import { DrawProps, ProfilePoint } from "./util";

type ProfilePointsProps = DrawProps & {
  profilePoints: ProfilePoint[];
};

export const ProfilePoints = ({
  profilePoints,
  strokeWidth,
}: ProfilePointsProps) => {
  return profilePoints.map((p, i) => (
    <circle
      key={i}
      cx={p.position.x}
      cy={p.position.y}
      r={strokeWidth * 2}
      fill={p.color}
    />
  ));
};

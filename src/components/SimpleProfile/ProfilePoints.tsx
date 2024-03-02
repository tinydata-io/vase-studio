import { Color } from "@/lib/types";
import { DrawProps, ProfilePoint } from "./types";

type ProfilePointsProps = DrawProps & {
  profilePoints: ProfilePoint[];
  colors: Color[];
};

export const ProfilePoints = ({
  profilePoints,
  colors,
  strokeWidth,
}: ProfilePointsProps) => {
  return profilePoints.map((p, i) => (
    <circle
      key={i}
      cx={p.position.x}
      cy={p.position.y}
      r={strokeWidth * 2}
      fill={colors[p.pointSetIndex % colors.length]}
    />
  ));
};

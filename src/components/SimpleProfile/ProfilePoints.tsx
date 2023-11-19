import { DrawProps, ProfilePoint } from "./util";

type ProfilePointsProps = DrawProps & {
  profilePoints: ProfilePoint[];
};

export const ProfilePoints = (props: ProfilePointsProps) => {
  return props.profilePoints.map((p, i) => (
    <circle
      key={i}
      cx={p.position.x}
      cy={p.position.y}
      r={props.strokeWidth * 2}
      fill={p.color}
    />
  ));
};

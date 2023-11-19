// SimpleProfile is working like a kaleidoscope -- it divides plane into n sections and
// allows definition of reference points that are repeated across all sections.

// Looking at a single section, PointSet allows to define:
// - offset from the edge of the profile
// - number of points
// - angle start and angle step, expressed as 0-1 in terms of section arc

// Points generated by point sets are sorted by angle and will be used for profile curve generation.

import { calculateDrawProps, generateProfilePoints } from "./util";
import { GuideLines } from "./GuideLines";
import { GuideArc } from "./GuideArc";
import { ProfilePoints } from "./ProfilePoints";

export type PointSet = {
  offset: number;
  count: number;
  angleStart: number;
  angleStep: number;
  color: string;
};

export type SimpleProfileProps = {
  sections: number;
  profileDiameter: number;
  pointSets: PointSet[];
  width: number;
  height: number;
};

export const SimpleProfile = (props: SimpleProfileProps) => {
  const maxOffset = props.pointSets.reduce(
    (max, { offset }) => Math.max(max, offset),
    0
  );

  const profileRadius = props.profileDiameter / 2;
  const drawProps = calculateDrawProps(
    profileRadius,
    maxOffset,
    props.sections
  );

  const profilePoints = generateProfilePoints(
    profileRadius,
    props.sections,
    props.pointSets,
    drawProps.angleStart,
    drawProps.angleStep
  );

  return (
    <svg viewBox={drawProps.viewBox} width={props.width} height={props.height}>
      <GuideLines {...drawProps} />
      <GuideArc {...drawProps} />
      <ProfilePoints profilePoints={profilePoints} {...drawProps} />
    </svg>
  );
};

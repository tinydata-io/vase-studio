// SimpleProfile is working like a kaleidoscope -- it divides plane into n sections and
// allows definition of reference points that are repeated across all sections.

// Looking at a single section, PointSet allows to define:
// - offset from the edge of the profile
// - number of points
// - angle start and angle step, expressed as 0-1 in terms of section arc

// Points generated by point sets are sorted by angle and will be used for profile curve generation.

import { SizeUnit } from "@/lib/units";

import { PointSet } from "./types";
import { calculateDrawProps, generateProfile } from "./util";
import { GuideLines } from "./GuideLines";
import { GuideArc } from "./GuideArc";
import { ProfilePoints } from "./ProfilePoints";
import { ProfileCurve } from "./ProfileCurve";

export type SimpleProfileProps = {
  sections: number;
  profileDiameter: number;
  pointSets: PointSet[];
  width: number;
  height: number;
};

export const SimpleProfile = ({
  pointSets,
  profileDiameter,
  sections,
  width,
  height,
}: SimpleProfileProps) => {
  const maxOffset = pointSets.reduce(
    (max, { offset }) => Math.max(max, offset),
    0
  );

  const profileRadius = profileDiameter / 2;
  const drawProps = calculateDrawProps(profileRadius, maxOffset, sections);

  const profile = generateProfile(
    profileRadius,
    sections,
    pointSets,
    drawProps.angleStart,
    drawProps.angleStep,
    SizeUnit.Centimeter
  );

  return (
    <svg viewBox={drawProps.viewBox} width={width} height={height}>
      <GuideLines {...drawProps} />
      <GuideArc {...drawProps} />
      <ProfilePoints profilePoints={profile.controlPoints} {...drawProps} />
      <ProfileCurve profileCurve={profile.curvePoints} {...drawProps} />
    </svg>
  );
};

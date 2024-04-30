// SimpleProfile is working like a kaleidoscope -- it divides plane into n sections and
// allows definition of reference points that are repeated across all sections.

// Looking at a single section, PointSet allows to define:
// - offset from the edge of the profile
// - number of points
// - angle start and angle step, expressed as 0-1 in terms of section arc

// Points generated by point sets are sorted by angle and will be used for profile curve generation.

import { SizeUnit } from "@/lib/units";
import { Color, VaseProfile } from "@/lib/types";

import { Curve } from "@/components/svg";

import {
  calculateDrawProps,
  generateProfile,
  modifyProfilePoint,
} from "./util";
import { GuideLines } from "./GuideLines";
import { GuideArc } from "./GuideArc";
import { ProfilePoints } from "./ProfilePoints";

export type SimpleProfileProps = {
  profile: VaseProfile;
  profileDiameter: number;
  sizeUnit: SizeUnit;
  colors: Color[];
  width: number;
  height: number;
  debugPoints?: boolean;
  intensity?: number;
};

export const SimpleProfile = ({
  profile,
  profileDiameter,
  sizeUnit,
  width,
  height,
  colors,
  debugPoints,
  intensity,
}: SimpleProfileProps) => {
  const maxOffset = profile.pointSets.reduce(
    (max, { offset }) => Math.max(max, offset.value),
    0
  );

  const profileRadius = profileDiameter / 2;

  const desiredIntensity = intensity == undefined ? 1 : intensity;
  const generatedProfile = generateProfile(profileRadius, sizeUnit, profile);
  const controlPoints = generatedProfile.controlPoints.map((pp) => {
    return {
      ...pp,
      position: modifyProfilePoint(
        pp.position,
        profileRadius,
        profileRadius,
        desiredIntensity
      ),
    };
  });

  const curvePoints = generatedProfile.curvePoints.map((cp) =>
    modifyProfilePoint(cp, profileRadius, profileRadius, desiredIntensity)
  );

  const drawProps = calculateDrawProps(
    profileRadius,
    maxOffset,
    generatedProfile
  );

  return (
    <svg viewBox={drawProps.viewBox} width={width} height={height}>
      <GuideLines {...drawProps} />
      <GuideArc {...drawProps} />
      <ProfilePoints
        profilePoints={controlPoints}
        colors={colors}
        {...drawProps}
      />
      <Curve
        curvePoints={curvePoints}
        strokeWidth={drawProps.strokeWidth}
        closed={true}
      />
      {debugPoints &&
        curvePoints.map((cp, index) => (
          <circle
            key={index}
            cx={cp.x}
            cy={cp.y}
            r={drawProps.strokeWidth / 2}
            fill="red"
          />
        ))}
    </svg>
  );
};

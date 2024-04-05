import log from "loglevel";

import {
  Vec2,
  catmullRomCurvePoint,
  distanceSqr,
  estimateCatmullRomCurveLength,
  pointOnCircle,
  rotate,
  simplifyProfilePoints,
} from "@/lib/math2d";

import { SizeUnit, ProfileOptimisationSettings } from "@/lib/units";

import { PointSet, VaseProfile } from "@/lib/types";
import { DrawProps, GeneratedProfile, ProfilePoint } from "./types";

export const ANGLE_EPSILON = (0.01 * (Math.PI * 2)) / 360; // 0.01 deg

// common function for calculating draw props of compontents building SimpleProfile
export const calculateDrawProps = (
  profileRadius: number,
  maxOffset: number,
  profile: GeneratedProfile
): DrawProps => {
  const maxRadius = profileRadius + maxOffset;
  const strokeWidth = maxRadius / 128.0;

  const vbPadding = strokeWidth * 4;
  const vbMinX = -maxRadius - vbPadding;
  const vbMinY = -maxRadius - vbPadding;
  const vbWidth = 2 * (maxRadius + vbPadding);
  const vbHeight = 2 * (maxRadius + vbPadding);
  const viewBox = `${vbMinX} ${vbMinY} ${vbWidth} ${vbHeight}`;

  return {
    strokeWidth: strokeWidth,
    viewBox: viewBox,
    sections: profile.sections,
    angleStart: profile.angleStart,
    angleStep: profile.angleStep,
    profileRadius: profileRadius,
    maxOffset: maxRadius,
  };
};

// generates segment points for a single section
export const generateSegmentProfilePoints = (
  profileRadius: number,
  minAngle: number,
  maxAngle: number,
  pointSet: PointSet,
  pointSetIndex: number
): ProfilePoint[] => {
  const points = [];

  for (let i = 0; i < pointSet.count; i++) {
    const segmentAngle = pointSet.angleStart + pointSet.angleStep * i;
    const angle = segmentAngle * (maxAngle - minAngle) + minAngle;

    const position = pointOnCircle(
      profileRadius + pointSet.offset.value,
      angle
    );

    points.push({
      position: position,
      angle: angle,
      pointSetIndex: pointSetIndex,
      weightIn: pointSet.offset.weightIn || 0,
      weightOut: pointSet.offset.weightOut || 0,
    });
  }

  return points;
};

// sorts points by angle and priority (order of source PointSets)
export const sortProfilePoints = (profilePoints: ProfilePoint[]) => {
  profilePoints.sort((a, b) => {
    if (a.angle < b.angle) {
      return -1;
    }

    if (a.angle > b.angle) {
      return 1;
    }

    if (a.pointSetIndex < b.pointSetIndex) {
      return -1;
    }

    if (a.pointSetIndex > b.pointSetIndex) {
      return 1;
    }

    return 0;
  });
};

export const sortCurvePoints = (curvePoints: Vec2[]) => {
  const pointsWithAngles = curvePoints.map((point) => {
    return {
      point: point,
      angle: Math.atan2(point.y, point.x),
    };
  });

  pointsWithAngles.sort((a, b) => {
    if (a.angle < b.angle) {
      return -1;
    }

    if (a.angle > b.angle) {
      return 1;
    }

    return 0;
  });

  return pointsWithAngles.map((point) => point.point);
};

// generate curve for a single section
export const generateProfileSectionCurve = (
  profileSectionPoints: ProfilePoint[],
  minSectionAngle: number,
  maxSectionAngle: number,
  sizeUnit: SizeUnit
): Vec2[] => {
  if (profileSectionPoints.length < 2) {
    return [];
  }

  const sectionAngle = maxSectionAngle - minSectionAngle;
  const sectionAngleCos = Math.cos(sectionAngle);
  const sectionAngleSin = Math.sin(sectionAngle);

  const sectionFirstPoint = profileSectionPoints[0];
  const sectionSecondPoint = profileSectionPoints[1];
  const sectionLastPoint =
    profileSectionPoints[profileSectionPoints.length - 1];

  const pp: Vec2[] = [
    rotate(sectionLastPoint.position, sectionAngleCos, -sectionAngleSin), // rotate -sectionAngle (last point in prev section)
    ...profileSectionPoints.map((point) => point.position),
    rotate(sectionFirstPoint.position, sectionAngleCos, sectionAngleSin), // rotate sectionAngle (first point in next section)
    rotate(sectionSecondPoint.position, sectionAngleCos, sectionAngleSin), // rotate sectionAngle (second point in next section)
  ];

  const sp = [
    sectionLastPoint,
    ...profileSectionPoints,
    sectionFirstPoint,
    sectionSecondPoint,
  ];

  const os = ProfileOptimisationSettings[sizeUnit];

  const points: Vec2[] = [];

  for (let i = 1; i < pp.length - 2; i++) {
    const p0 = pp[i - 1];
    const p1 = pp[i];
    const p2 = pp[i + 1];
    const p3 = pp[i + 2];

    const weightStart = sp[i].weightOut;
    const weightEnd = sp[i + 1].weightIn;

    let prev = p1;
    let prevAngle = Math.atan2(prev.y, prev.x);

    const segmentLength = estimateCatmullRomCurveLength(
      p0,
      p1,
      p2,
      p3,
      weightStart,
      weightEnd,
      os.minDistance
    );

    const steps = Math.ceil(segmentLength / os.minDistance);
    const step = 1 / steps;

    const segmentPoints: Vec2[] = [p1];

    for (let j = 1; j <= steps; j++) {
      const t = j * step;
      let point = catmullRomCurvePoint(
        p0,
        p1,
        p2,
        p3,
        weightStart,
        weightEnd,
        t
      );

      const pointAngle = Math.atan2(point.y, point.x);

      // prev and point are not oriented clockwise, rotate point to fix it
      if (pointAngle < prevAngle + ANGLE_EPSILON) {
        const angleDiff = prevAngle + ANGLE_EPSILON - pointAngle;
        point = rotate(point, Math.cos(angleDiff), Math.sin(angleDiff));
      }

      // outside of the section
      if (
        pointAngle < minSectionAngle - ANGLE_EPSILON ||
        pointAngle > maxSectionAngle + ANGLE_EPSILON
      ) {
        continue;
      }

      const distSqr = distanceSqr(prev, point);

      // too close to the previous point, skip one point, but preserve the last one
      if (distSqr <= os.minDistanceSqr) {
        if (j !== steps) {
          continue;
        } else {
          segmentPoints.pop();
        }
      }

      segmentPoints.push(point);
      prev = point;
      prevAngle = pointAngle;
    }

    // simplify each segment independently
    const simplifiedSegmentPoints = simplifyProfilePoints(
      segmentPoints,
      os.minSimplifyArea
    );

    simplifiedSegmentPoints.pop(); // remove the last point, because it's the same as the first point of the next segment

    points.push(...simplifiedSegmentPoints);
  }

  // not enough points generated
  if (points.length < 3) {
    return [];
  }

  const rotatedFirstPoint = rotate(points[0], sectionAngleCos, sectionAngleSin);

  // last point is too close to the first point == the same point after rotation
  if (
    distanceSqr(rotatedFirstPoint, points[points.length - 1]) <=
    os.minDistanceSqr
  ) {
    points.pop();
  }

  return points;
};

export const generateProfile = (
  radius: number,
  sizeUnit: SizeUnit,
  profile: VaseProfile
): GeneratedProfile => {
  const referencePoints: ProfilePoint[] = [];

  const angleStep = (Math.PI * 2) / profile.sections;
  const angleStart = -angleStep / 2 - Math.PI / 2;

  const minAngle = angleStart + angleStep;
  const maxAngle = minAngle + angleStep;

  profile.pointSets.forEach((pointSet, index) => {
    referencePoints.push(
      ...generateSegmentProfilePoints(
        radius,
        minAngle,
        maxAngle,
        pointSet,
        index
      )
    );
  });

  sortProfilePoints(referencePoints);

  var startTime = performance.now();

  const curveReferencePoints = generateProfileSectionCurve(
    referencePoints,
    minAngle,
    maxAngle,
    sizeUnit
  );

  var endTime = performance.now();

  log.debug("generateProfileCurve", endTime - startTime, "ms");

  const points = [...referencePoints];
  const curvePoints = [...curveReferencePoints];

  // generate full profile by rotating reference points for each section
  for (let i = 1; i < profile.sections; i++) {
    const rotationAngle = angleStep * i;
    const cosAngle = Math.cos(rotationAngle);
    const sinAngle = Math.sin(rotationAngle);

    referencePoints.forEach((point) => {
      points.push({
        ...point,
        position: rotate(point.position, cosAngle, sinAngle),
      });
    });

    curveReferencePoints.forEach((point) => {
      curvePoints.push(rotate(point, cosAngle, sinAngle));
    });
  }

  sortProfilePoints(points);
  sortCurvePoints(curvePoints);

  log.debug("totalPoints", curvePoints.length);

  return {
    referencePoints: referencePoints,
    controlPoints: points,
    curvePoints: curvePoints,
    sections: profile.sections,
    angleStart: angleStart,
    angleStep: angleStep,
  };
};

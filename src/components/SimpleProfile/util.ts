import {
  Vec2,
  catmullRomCurvePoint,
  distanceSqr,
  estimateCatmullRomCurveLength,
  pointOnCircle,
  rotate,
  simplifyProfilePoints,
} from "@/lib/math2d";

import {
  SizeUnit,
  minDistanceForUnit,
  minSimplifyAreaForUnit,
} from "@/lib/units";

import { DrawProps, PointSet, Profile, ProfilePoint } from "./types";

export const ANGLE_EPSILON = (0.01 * (Math.PI * 2)) / 360; // 0.01 deg

// common function for calculating draw props of compontents building SimpleProfile
export const calculateDrawProps = (
  profileRadius: number,
  maxOffset: number,
  sections: number
): DrawProps => {
  const maxRadius = profileRadius + maxOffset;
  const strokeWidth = maxRadius / 128.0;

  const vbPadding = strokeWidth * 4;
  const vbMinX = -maxRadius - vbPadding;
  const vbMinY = -maxRadius - vbPadding;
  const vbWidth = 2 * (maxRadius + vbPadding);
  const vbHeight = 2 * (maxRadius + vbPadding);
  const viewBox = `${vbMinX} ${vbMinY} ${vbWidth} ${vbHeight}`;

  const sectionAngle = (Math.PI * 2) / sections;
  const angleStart = -sectionAngle / 2 - Math.PI / 2;

  return {
    strokeWidth: strokeWidth,
    viewBox: viewBox,
    sections: sections,
    angleStart: angleStart,
    angleStep: sectionAngle,
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
  priority: number
): ProfilePoint[] => {
  const points = [];

  for (let i = 0; i < pointSet.count; i++) {
    const segmentAngle = pointSet.angleStart + pointSet.angleStep * i;
    const angle = segmentAngle * (maxAngle - minAngle) + minAngle;

    const position = pointOnCircle(profileRadius + pointSet.offset, angle);

    points.push({
      position: position,
      angle: angle,
      priority: priority,
      color: pointSet.color,
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

    if (a.priority < b.priority) {
      return -1;
    }

    if (a.priority > b.priority) {
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

  const minDistance = minDistanceForUnit(sizeUnit);
  const minDistanceSqr = minDistance * minDistance;

  let prev = pp[1];
  let prevAngle = Math.atan2(prev.y, prev.x);
  const points: Vec2[] = [prev];

  for (let i = 1; i < pp.length - 2; i++) {
    const p0 = pp[i - 1];
    const p1 = pp[i];
    const p2 = pp[i + 1];
    const p3 = pp[i + 2];

    const segmentLength = estimateCatmullRomCurveLength(
      p0,
      p1,
      p2,
      p3,
      minDistance
    );

    const steps = Math.ceil(segmentLength / minDistance);
    const step = 1 / steps;

    for (let j = 1; j < steps; j++) {
      const t = (j + 1) * step;
      let point = catmullRomCurvePoint(p0, p1, p2, p3, t);

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

      // too close to the previous point
      if (distSqr <= minDistanceSqr) {
        continue;
      }

      points.push(point);
      prev = point;
      prevAngle = pointAngle;
    }
  }

  // no points generated
  if (points.length == 0) {
    return [];
  }

  // last point is too close to the first point == the same point after rotation
  if (distanceSqr(points[0], points[points.length - 1]) <= minDistanceSqr) {
    points.pop();
  }

  // TODO: remove before rollout
  console.log("generated points: ", points.length);

  const minSimplifyArea = minSimplifyAreaForUnit(sizeUnit);
  const simplified = simplifyProfilePoints(points, minSimplifyArea);

  // TODO: remove before rollout
  console.log("simplified points: ", simplified.length);

  return simplified;
};

export const generateProfile = (
  profileRadius: number,
  sections: number,
  pointSets: PointSet[],
  angleStart: number,
  angleStep: number,
  sizeUnit: SizeUnit
): Profile => {
  const referencePoints: ProfilePoint[] = [];

  const minAngle = angleStart + angleStep;
  const maxAngle = minAngle + angleStep;

  pointSets.forEach((pointSet, index) => {
    referencePoints.push(
      ...generateSegmentProfilePoints(
        profileRadius,
        minAngle,
        maxAngle,
        pointSet,
        index
      )
    );
  });

  sortProfilePoints(referencePoints);

  // TODO: remove before rollout
  console.time("generateProfileCurve");

  const curveReferencePoints = generateProfileSectionCurve(
    referencePoints,
    minAngle,
    maxAngle,
    sizeUnit
  );

  // TODO: remove before rollout
  console.timeEnd("generateProfileCurve");

  const points = [...referencePoints];
  const curvePoints = [...curveReferencePoints];

  // generate full profile by rotating reference points for each section
  for (let i = 1; i < sections; i++) {
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

  // TODO: remove before rollout
  console.log("total curve points: ", curvePoints.length);

  return {
    referencePoints: referencePoints,
    controlPoints: points,
    curvePoints: curvePoints,
    sections: sections,
    angleStep: angleStep,
  };
};

import { SizeUnit } from "@/lib/types";
import { ProfilePoint, Vec2, distance, distanceSqr, rotate } from "./util";

export const ANGLE_EPSILON = (0.01 * (Math.PI * 2)) / 360; // 0.01 deg

export const minDistanceForUnit = (sizeUnit: SizeUnit): number => {
  switch (sizeUnit) {
    case SizeUnit.Centimeter:
      return 0.1;
    case SizeUnit.Inch:
      return 0.0393701; // 1 mm
  }
};

export const minSimplifyAreaForUnit = (sizeUnit: SizeUnit): number => {
  switch (sizeUnit) {
    case SizeUnit.Centimeter:
      return 0.12 ** 2;
    case SizeUnit.Inch:
      return 0.0472441; // 1.2 mm ^ 2
  }
};

// https://dev.to/ndesmic/splines-from-scratch-catmull-rom-3m66
export const catmullRomCurvePoint = (
  p0: Vec2,
  p1: Vec2,
  p2: Vec2,
  p3: Vec2,
  t: number
): Vec2 => {
  const t2 = t * t;
  const t3 = t2 * t;

  const b1 = -t3 + 2 * t2 - t;
  const b2 = 3 * t3 - 5 * t2 + 2;
  const b3 = -3 * t3 + 4 * t2 + t;
  const b4 = t3 - t2;

  return {
    x: 0.5 * (p0.x * b1 + p1.x * b2 + p2.x * b3 + p3.x * b4),
    y: 0.5 * (p0.y * b1 + p1.y * b2 + p2.y * b3 + p3.y * b4),
  };
};

export const estimateCatmullRomCurveLength = (
  p0: Vec2,
  p1: Vec2,
  p2: Vec2,
  p3: Vec2,
  minDistance: number
): number => {
  const segmentLenth = distance(p1, p2);
  const steps = Math.ceil(segmentLenth / minDistance);
  const step = 1 / steps;

  let length = 0;
  let prev = catmullRomCurvePoint(p0, p1, p2, p3, 0);

  for (let i = 0; i < steps; i++) {
    const t = (i + 1) * step;
    const point = catmullRomCurvePoint(p0, p1, p2, p3, t);

    length += distance(prev, point);

    prev = point;
  }

  return length;
};

// area of triangle created from colinear points is 0, remove points below minSimplifyArea
export const simplifyProfilePoints = (
  points: Vec2[],
  minSimplifyArea: number
): Vec2[] => {
  const simplified: Vec2[] = [points[0], points[1]];

  for (let i = 2; i < points.length; i++) {
    const p1 = simplified[simplified.length - 2];
    const p2 = simplified[simplified.length - 1];
    const p3 = points[i];

    const triangleArea = Math.abs(
      p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)
    );

    if (triangleArea < minSimplifyArea) {
      simplified.pop();
    }

    simplified.push(p3);
  }

  return simplified;
};

export const generateProfileSectionCurve = (
  profileSectionPoints: ProfilePoint[],
  minSectionAngle: number,
  maxSectionAngle: number,
  sizeUnit: SizeUnit
): Vec2[] => {
  if (profileSectionPoints.length < 2) {
    return [];
  }

  const psp = profileSectionPoints;
  const sectionAngle = maxSectionAngle - minSectionAngle;
  const sectionAngleCos = Math.cos(sectionAngle);
  const sectionAngleSin = Math.sin(sectionAngle);

  const pp: Vec2[] = [
    rotate(psp[psp.length - 1].position, sectionAngleCos, -sectionAngleSin), // rotate -sectionAngle (prev section)
    ...psp.map((point) => point.position),
    rotate(psp[0].position, sectionAngleCos, sectionAngleSin), // rotate sectionAngle (next section)
    rotate(psp[1].position, sectionAngleCos, sectionAngleSin), // rotate sectionAngle (next section)
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

  return simplified;
};

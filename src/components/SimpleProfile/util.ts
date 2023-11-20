import { SizeUnit } from "@/lib/types";
import { PointSet } from ".";
import { generateProfileSectionCurve } from "./curve";

export type Vec2 = {
  x: number;
  y: number;
};

export type ProfilePoint = {
  position: Vec2;
  angle: number;
  priority: number;
  color: string;
};

export type DrawProps = {
  strokeWidth: number;
  viewBox: string;
  sections: number;
  angleStart: number;
  angleStep: number;
  profileRadius: number;
  maxOffset: number;
};

export type Profile = {
  referencePoints: ProfilePoint[];
  controlPoints: ProfilePoint[];
  curvePoints: Vec2[];
  sections: number;
  angleStep: number;
};

export const distanceSqr = (a: Vec2, b: Vec2): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return dx * dx + dy * dy;
};

export const distance = (a: Vec2, b: Vec2): number => {
  return Math.sqrt(distanceSqr(a, b));
};

export const pointOnCircle = (radius: number, angle: number): Vec2 => {
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };
};

export const rotate = (
  point: Vec2,
  cosAngle: number,
  sinAngle: number
): Vec2 => {
  return {
    x: point.x * cosAngle - point.y * sinAngle,
    y: point.x * sinAngle + point.y * cosAngle,
  };
};

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

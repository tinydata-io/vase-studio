import { PointSet } from ".";

type Vec2 = {
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

export const pointOnCircle = (radius: number, angle: number): Vec2 => {
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
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

export const generateProfilePoints = (
  profileRadius: number,
  sections: number,
  pointSets: PointSet[],
  angleStart: number,
  angleStep: number
): ProfilePoint[] => {
  const points: ProfilePoint[] = [];

  for (let i = 0; i < sections; i++) {
    const minAngle = angleStart + angleStep * i;
    const maxAngle = minAngle + angleStep;

    pointSets.forEach((pointSet, index) => {
      points.push(
        ...generateSegmentProfilePoints(
          profileRadius,
          minAngle,
          maxAngle,
          pointSet,
          index
        )
      );
    });
  }

  sortProfilePoints(points);

  return points;
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

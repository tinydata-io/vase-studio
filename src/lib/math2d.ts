export type Vec2 = {
  x: number;
  y: number;
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

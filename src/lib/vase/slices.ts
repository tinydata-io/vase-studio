import { VaseSlice } from "@/lib/types";
import {
  Vec2,
  catmullRomCurvePoint,
  distanceSqr,
  estimateCatmullRomCurveLength,
  simplifyProfilePoints,
} from "@/lib/math2d";
import {
  SizeUnit,
  minDistanceForUnit,
  minSimplifyAreaForUnit,
} from "@/lib/units";

export function getSideProfile(
  slices: VaseSlice[],
  height: number,
  sizeUnit: SizeUnit
): Vec2[] {
  const sortedSlices = [...slices].sort((a, b) => a.position - b.position);

  const result = [];

  const getPoint = (slice: VaseSlice): Vec2 => {
    return { x: slice.radius.value, y: slice.position * height };
  };

  const minDistance = minDistanceForUnit(sizeUnit);
  const minDistanceSqr = minDistance * minDistance;
  const minSimplifyArea = minSimplifyAreaForUnit(sizeUnit);

  for (let i = 0; i < sortedSlices.length - 1; i++) {
    const s0 = sortedSlices[Math.max(0, i - 1)];
    const s1 = sortedSlices[i];
    const s2 = sortedSlices[i + 1];
    const s3 = sortedSlices[Math.min(sortedSlices.length - 1, i + 2)];

    const p0 = getPoint(s0);
    const p1 = getPoint(s1);
    const p2 = getPoint(s2);
    const p3 = getPoint(s3);

    const weightStart = s1.radius.weightOut || 0;
    const weightEnd = s2.radius.weightIn || 0;

    const estimatedSegmentLength = estimateCatmullRomCurveLength(
      p0,
      p1,
      p2,
      p3,
      weightStart,
      weightEnd,
      minDistance
    );

    const steps = Math.ceil(estimatedSegmentLength / minDistance);
    const step = 1 / steps;

    let points: Vec2[] = [p1];
    let prevPoint = p1;

    for (let j = 1; j < steps; j++) {
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

      // if (distanceSqr(point, prevPoint) > minDistanceSqr) {
      //   points.push(point);
      // }

      points.push(point);

      prevPoint = point;
    }

    points = simplifyProfilePoints(points, minSimplifyArea);

    result.push(...points);

    console.log(points.length);
  }

  console.log(result.length);

  return result;
}

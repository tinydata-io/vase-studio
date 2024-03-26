import { VaseSlice, WeightedNumber } from "@/lib/types";
import {
  Vec2,
  catmullRomCurvePoint,
  distanceSqr,
  estimateCatmullRomCurveLength,
  simplifyProfilePoints,
} from "@/lib/math2d";
import { SidePathOptimisationSettings, SizeUnit } from "@/lib/units";

type SliceProperty = {
  value: WeightedNumber;
  y: number;
};
type PropertySelector = (slice: VaseSlice) => WeightedNumber | undefined;

export function selectSlices(
  slices: VaseSlice[],
  height: number,
  selector: PropertySelector
): SliceProperty[] {
  const sortedSlices = [...slices].sort((a, b) => a.position - b.position);
  const result: SliceProperty[] = [];

  for (const slice of sortedSlices) {
    const value = selector(slice);

    if (value) {
      const y = slice.position * height;
      result.push({ value, y });
    }
  }

  return result;
}

export function evaluateSlices(
  sliceProperties: SliceProperty[],
  sizeUnit: SizeUnit
): Vec2[] {
  const result = [];

  const os = SidePathOptimisationSettings[sizeUnit];

  for (let i = 0; i < sliceProperties.length - 1; i++) {
    const s0 = sliceProperties[Math.max(0, i - 1)];
    const s1 = sliceProperties[i];
    const s2 = sliceProperties[i + 1];
    const s3 = sliceProperties[Math.min(sliceProperties.length - 1, i + 2)];

    const p0 = { x: s0.value.value, y: s0.y };
    const p1 = { x: s1.value.value, y: s1.y };
    const p2 = { x: s2.value.value, y: s2.y };
    const p3 = { x: s3.value.value, y: s3.y };

    const weightStart = s1.value.weightOut || 0;
    const weightEnd = s2.value.weightIn || 0;

    const estimatedSegmentLength = estimateCatmullRomCurveLength(
      p0,
      p1,
      p2,
      p3,
      weightStart,
      weightEnd,
      os.minDistance
    );

    const steps = Math.ceil(estimatedSegmentLength / os.minDistance);
    const step = 1 / steps;

    let points: Vec2[] = [p1];
    let prevPoint = p1;

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

      const distSqr = distanceSqr(prevPoint, point);

      // too close to the previous point, skip one point, but preserve the last one
      if (distSqr <= os.minDistanceSqr) {
        if (j !== steps) {
          continue;
        } else {
          points.pop();
        }
      }

      points.push(point);

      prevPoint = point;
    }

    points = simplifyProfilePoints(points, os.minSimplifyArea);

    // Remove the last point if it's not the last segment, because it's the same as the first point of the next segment
    if (i !== sliceProperties.length - 2) {
      points.pop();
    }

    result.push(...points);
  }

  return result;
}

export function getRadius(
  slices: VaseSlice[],
  height: number,
  sizeUnit: SizeUnit
): Vec2[] {
  const sliceProperties = selectSlices(slices, height, (slice) => slice.radius);
  return evaluateSlices(sliceProperties, sizeUnit);
}

export function getRotation(
  slices: VaseSlice[],
  height: number,
  sizeUnit: SizeUnit
): Vec2[] {
  const sliceProperties = selectSlices(
    slices,
    height,
    (slice) => slice.rotation
  );
  return evaluateSlices(sliceProperties, sizeUnit);
}

import { VaseSlice, WeightedNumber } from "@/lib/types";
import {
  Vec2,
  catmullRomCurvePoint,
  distanceSqr,
  estimateCatmullRomCurveLength,
} from "@/lib/math2d";
import { SidePathOptimisationSettings, SizeUnit, Epsilon } from "@/lib/units";

type SliceProperty = {
  value: WeightedNumber;
  y: number;
};

type PropertySelector = (slice: VaseSlice) => WeightedNumber | undefined;

export function selectSlices(
  slices: VaseSlice[],
  yStep: number | undefined,
  height: number,
  selector: PropertySelector
): SliceProperty[] {
  const sortedSlices = [...slices].sort((a, b) => a.position - b.position);
  const result: SliceProperty[] = [];

  for (const slice of sortedSlices) {
    const value = selector(slice);

    if (value) {
      const y = slice.position * height;
      const alignedY = yStep ? Math.round(y / yStep) * yStep : y;
      result.push({ value, y: alignedY });
    }
  }

  return result;
}

type TransformFunction = (p: Vec2) => Vec2;

export function evaluateSlices(
  sliceProperties: SliceProperty[],
  height: number,
  sizeUnit: SizeUnit,
  transformFunction: TransformFunction = (p: Vec2) => p
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

    // get more steps than it is required from length estimation, simplify while
    // adding new points to get more uniform result
    const steps = 4 * Math.ceil(estimatedSegmentLength / os.minDistance);
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

      point = transformFunction(point);

      const distSqr = distanceSqr(prevPoint, point);
      const yDist = point.y - prevPoint.y;

      if (
        distSqr <= os.minDistanceSqr || // too close to the previous point
        point.y < 0 + Epsilon || // negative y
        point.y > height + Epsilon || // more than vase height
        yDist < os.minSliceDistance || // too close to the previous slice
        yDist < 0 // next point was generated below the previous one, skip
      ) {
        // skip one point, but preserve the last one
        if (j !== steps) {
          continue;
        } else {
          points.pop();
        }
      }

      points.push(point);

      prevPoint = point;
    }

    // Remove the last point if it's not the last segment, because it's the same as the first point of the next segment
    if (i !== sliceProperties.length - 2) {
      points.pop();
    }

    result.push(...points);
  }

  return result;
}

export type Deconstructor = (
  slices: VaseSlice[],
  height: number,
  sizeUnit: SizeUnit,
  yStep: number | undefined
) => Vec2[];

export function getRadius(
  slices: VaseSlice[],
  height: number,
  sizeUnit: SizeUnit,
  yStep: number | undefined
): Vec2[] {
  const sliceProperties = selectSlices(
    slices,
    yStep,
    height,
    (slice) => slice.radius
  );
  return evaluateSlices(sliceProperties, height, sizeUnit);
}

export function getRotation(
  slices: VaseSlice[],
  height: number,
  sizeUnit: SizeUnit,
  yStep: number | undefined
): Vec2[] {
  const sliceProperties = selectSlices(
    slices,
    yStep,
    height,
    (slice) => slice.rotation
  );
  return evaluateSlices(sliceProperties, height, sizeUnit);
}

export function getIntensity(
  slices: VaseSlice[],
  height: number,
  sizeUnit: SizeUnit,
  yStep: number | undefined
): Vec2[] {
  const clamp = (p: Vec2) => {
    return { x: Math.min(Math.max(0, p.x), 1), y: p.y };
  };

  const sliceProperties = selectSlices(
    slices,
    yStep,
    height,
    (slice) => slice.intensity
  );
  return evaluateSlices(sliceProperties, height, sizeUnit, clamp);
}

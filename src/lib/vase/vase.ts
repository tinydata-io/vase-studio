import { Vase } from "@/lib/types";
import { Vec2, rotate } from "@/lib/math2d";

import { getRotation, getRadius, getIntensity } from "@/lib/vase/slices";
import {
  generateProfile,
  modifyProfilePoint,
  splitLongSegments,
} from "@/components/SimpleProfile/util";
import { EPSILON } from "@/lib/units";

export type ModelSlice = {
  y: number;
  external: Vec2[];
};

type SliceAttributesIndex =
  | {
      lastRadiusIndex: number;
      lastIntensityIndex: number;
      lastRotationIndex: number;
    }
  | undefined;

type SliceAttributes = {
  radius: number;
  intensity: number;
  rotation: number;
  lastIndex: SliceAttributesIndex;
};

type CorrespondingSlices = {
  prev: Vec2 | undefined;
  next: Vec2 | undefined;
  lastIndex: number;
};

const findCorrespondingSlices = function (
  vs: Vec2[],
  y: number,
  lastIndex: number = 0
): CorrespondingSlices {
  let prev = lastIndex === 0 ? undefined : vs[lastIndex - 1];

  for (let i = lastIndex; i < vs.length; i++) {
    const v = vs[i];

    if (v.y >= y) {
      return {
        prev,
        next: v,
        lastIndex: i,
      };
    }

    prev = v;
  }

  return {
    prev,
    next: undefined,
    lastIndex: vs.length,
  };
};

const angleDiff = (a: number, b: number): number => {
  if (a > b) {
    return angleDiff(b, a);
  }

  return Math.min(b - a, a + Math.PI * 2 - b);
};

const interpolate = function (y: number, ps?: Vec2, ns?: Vec2): number {
  if (!ps) {
    return ns!.x;
  }

  if (!ns) {
    return ps.x;
  }

  const t = (y - ps.y) / (ns.y - ps.y);
  return ps.x + t * (ns.x - ps.x);
};

export const getVaseModelSlices = (vase: Vase, yStep: number): ModelSlice[] => {
  const result = Array<ModelSlice>();

  const { values: rotationSlices } = getRotation(
    vase,
    vase.height,
    vase.sizeUnit,
    yStep
  );

  const { values: radiusSlices } = getRadius(
    vase,
    vase.height,
    vase.sizeUnit,
    yStep
  );

  const { values: intensitySlices } = getIntensity(
    vase,
    vase.height,
    vase.sizeUnit,
    yStep
  );

  const referenceRadius = Math.max(...radiusSlices.map((s) => s.x));
  const referenceProfile = generateProfile(
    referenceRadius,
    vase.sizeUnit,
    vase.profile
  );

  const ys = new Array<number>();

  for (let y = 0; y <= vase.height + EPSILON; y += yStep) {
    ys.push(y);
  }

  const getSliceAttributes = (
    y: number,
    index: SliceAttributesIndex
  ): SliceAttributes => {
    // as ys are increasing in subsequent calls, we can remember when iteration
    // was interrupted and continue from that place
    const foundRadiusSlices = findCorrespondingSlices(
      radiusSlices,
      y,
      index?.lastRadiusIndex || 0
    );
    const foundIntensitySlices = findCorrespondingSlices(
      intensitySlices,
      y,
      index?.lastIntensityIndex || 0
    );
    const foundRotationsLices = findCorrespondingSlices(
      rotationSlices,
      y,
      index?.lastRotationIndex || 0
    );

    const radius = interpolate(
      y,
      foundRadiusSlices.prev,
      foundRadiusSlices.next
    );
    const intensity = interpolate(
      y,
      foundIntensitySlices.prev,
      foundIntensitySlices.next
    );
    const rotation = interpolate(
      y,
      foundRotationsLices.prev,
      foundRotationsLices.next
    );

    return {
      radius,
      intensity,
      rotation,
      lastIndex: {
        lastRadiusIndex: foundRadiusSlices.lastIndex,
        lastIntensityIndex: foundIntensitySlices.lastIndex,
        lastRotationIndex: foundRotationsLices.lastIndex,
      },
    };
  };

  const addMeshSlice = (
    y: number,
    radius: number,
    intensity: number,
    rotation: number
  ) => {
    const cosAngle = Math.cos(rotation);
    const sinAngle = Math.sin(rotation);

    let externalPoints = referenceProfile.curvePoints.map((p) => {
      return modifyProfilePoint(p, referenceRadius, radius, intensity);
    });

    externalPoints = splitLongSegments(
      externalPoints,
      referenceProfile.subdivisions
    );

    externalPoints = externalPoints.map((p) => {
      return rotate(p, cosAngle, sinAngle);
    });

    result.push({
      y: y,
      external: externalPoints,
    });
  };

  let index: SliceAttributesIndex = undefined;

  for (const y of ys) {
    const { radius, intensity, rotation, lastIndex } = getSliceAttributes(
      y,
      index
    );

    addMeshSlice(y, radius, intensity, rotation);

    index = lastIndex;
  }

  return result;
};

import { Vase } from "@/lib/types";
import { Vec2, rotate } from "@/lib/math2d";

import { getRotation, getRadius, getIntensity } from "@/lib/vase/slices";
import {
  generateProfile,
  modifyProfilePoint,
  splitLongSegments,
} from "@/components/SimpleProfile/util";

export type ModelSlice = {
  y: number;
  external: Vec2[];
};

const findCorrespondingSlices = function (vs: Vec2[], y: number) {
  let prev = undefined;

  for (let i = 0; i < vs.length; i++) {
    const v = vs[i];

    if (v.y >= y) {
      return [prev, v];
    }

    prev = v;
  }

  return [prev, undefined];
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

export const getVaseModelSlices = (vase: Vase): ModelSlice[] => {
  const result = Array<ModelSlice>();

  const rotationSlices = getRotation(vase.slices, vase.height, vase.sizeUnit);
  const radiusSlices = getRadius(vase.slices, vase.height, vase.sizeUnit);
  const intensitySlices = getIntensity(vase.slices, vase.height, vase.sizeUnit);

  const referenceRadius = Math.max(...radiusSlices.map((s) => s.x));
  const referenceProfile = generateProfile(
    referenceRadius,
    vase.sizeUnit,
    vase.profile
  );

  let ys = [
    ...rotationSlices.map((s) => s.y),
    ...radiusSlices.map((s) => s.y),
    ...intensitySlices.map((s) => s.y),
  ];

  ys.sort((a, b) => a - b);

  let prevY = -1;
  let prevRotation = 0;
  let prevRadius = 0;

  const getSliceAttributes = (y: number) => {
    // this could be optimised
    const [prevR, nextR] = findCorrespondingSlices(radiusSlices, y);
    const [prevI, nextI] = findCorrespondingSlices(intensitySlices, y);
    const [prevRot, nextRot] = findCorrespondingSlices(rotationSlices, y);

    const radius = interpolate(y, prevR, nextR);
    const intensity = interpolate(y, prevI, nextI);
    const rotation = interpolate(y, prevRot, nextRot);

    return { radius, intensity, rotation };
  };

  const addMeshSlice = (
    y: number,
    radius: number,
    intensity: number,
    rotation: number
  ) => {
    const cosAngle = Math.cos(rotation);
    const sinAngle = Math.sin(rotation);

    console.log(
      `addMeshSlice y=${y} referenceRadius=${referenceRadius} radius=${radius} intensity=${intensity} rotation=${rotation}`
    );

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

  for (const y of ys) {
    if (y === prevY) {
      continue;
    }

    const { radius, intensity, rotation } = getSliceAttributes(y);

    if (prevY >= 0) {
      const rotationDiff = angleDiff(prevRotation, rotation);
      const radialDiff = Math.max(radius, prevRadius) * rotationDiff;
      const horizontalDiff = y - prevY;

      console.log("radialDiff", radialDiff);
      console.log("horizontalDiff", horizontalDiff);

      const additionalSlices = Math.ceil((4 * horizontalDiff) / radialDiff);

      const dy = horizontalDiff / (additionalSlices + 1);

      console.log("prevY", prevY);

      for (let i = 1; i <= additionalSlices; i++) {
        const ay = prevY + i * dy;

        const { radius, intensity, rotation } = getSliceAttributes(ay);
        addMeshSlice(ay, radius, intensity, rotation);

        console.log("ay", ay);
      }

      console.log("y", y);
    }

    addMeshSlice(y, radius, intensity, rotation);

    prevY = y;
    prevRotation = rotation;
    prevRadius = radius;
  }

  return result;
};

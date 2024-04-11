import { Vase } from "@/lib/types";
import { Vec2, rotate } from "@/lib/math2d";

import { getRotation, getRadius, getIntensity } from "@/lib/vase/slices";
import { generateProfile } from "@/components/SimpleProfile/util";

export type ModelSlice = {
  y: number;
  external: Vec2[];
  originalAngles: number[];
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

  let ys = [
    ...rotationSlices.map((s) => s.y),
    ...radiusSlices.map((s) => s.y),
    ...intensitySlices.map((s) => s.y),
  ];

  ys.sort((a, b) => a - b);

  let prevY = -1;

  for (const y of ys) {
    if (y === prevY) {
      continue;
    }

    // this could be optimised
    const [prevR, nextR] = findCorrespondingSlices(radiusSlices, y);
    const [prevI, nextI] = findCorrespondingSlices(intensitySlices, y);
    const [prevRot, nextRot] = findCorrespondingSlices(rotationSlices, y);

    const radius = interpolate(y, prevR, nextR);
    const intensity = interpolate(y, prevI, nextI);
    const rotation = interpolate(y, prevRot, nextRot);

    const profile = generateProfile(
      radius,
      vase.sizeUnit,
      vase.profile,
      intensity
    );

    const cosAngle = Math.cos(rotation);
    const sinAngle = Math.sin(rotation);

    let externalPoints = profile.curvePoints.map((p) => ({
      p: rotate(p, cosAngle, sinAngle),
      originalAngle: Math.atan2(p.y, p.x),
    }));

    externalPoints.sort((a, b) => a.originalAngle - b.originalAngle);

    result.push({
      y: y,
      external: externalPoints.map((p) => p.p),
      originalAngles: externalPoints.map((p) => p.originalAngle),
    });

    prevY = y;
  }

  return result;
};

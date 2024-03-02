import { SizeUnit } from "./units";

export type Color = `#${string}`;

// point set defines curve control points generator
export type PointSet = {
  offset: number; // offset from the edge of the profile (in Vase SizeUnit)
  count: number; // number of points
  angleStart: number; // angle start, expressed as 0-1 in terms of section arc
  angleStep: number; // angle step, expressed as 0-1 in terms of section arc;

  smoothIn?: number; // 0-1 to define the smoothness of the curve going into the point
  smoothOut?: number; // 0-1 to define the smoothness of the curve going out of the point
};

export type Profile = {
  sections: number;
  pointSets: PointSet[];
};

export type SmoothNumber = {
  value: number;
  smoothIn?: number;
  smoothOut?: number;
};

export type Slice = {
  position: number; // position of the slice, expressed as 0-1 in terms of vase height
  radius: SmoothNumber;
  rotation: SmoothNumber; // rotation of the slice, expressed in degrees
};

export type Vase = {
  sizeUnit: SizeUnit;
  height: number; // height of the vase in sizeUnit
  thickness: number; // thickness of the vase in sizeUnit
  profile: Profile;
  slices: Slice[]; // vase requires at least one section, it will be extended to the full height
};

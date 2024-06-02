import { SizeUnit } from "./units";

export type Color = `#${string}`;

// Number with additional weights to define weight / smoothness of control points and slices
export type WeightedNumber = {
  value: number;
  weightIn?: number;
  weightOut?: number;
};

// PointSet defines curve control points generator
export type PointSet = {
  offset: WeightedNumber; // offset from the edge of the profile (in sizeUnit)
  count: number; // number of points
  angleStart: number; // angle start, expressed as 0-1 in terms of section arc
  angleStep: number; // angle step, expressed as 0-1 in terms of section arc
};

// Profile describes the profile of the vase, it works like a kaleidoscope with multiple sections
// repeating pattern defined by PointSets
export type VaseProfile = {
  sections: number;
  pointSets: PointSet[];
};

// position is number, but will be replaced with a custom slice position type, saved as string
export type SlicePosition = string;
export type SlicedValues = {
  [position: number]: WeightedNumber;
};

export type Vase = {
  sizeUnit: SizeUnit;
  height: number; // height of the vase in sizeUnit
  thickness: number; // thickness of the vase in sizeUnit
  profile: VaseProfile;

  radius: SlicedValues;
  rotation: SlicedValues;
  intensity: SlicedValues;
};

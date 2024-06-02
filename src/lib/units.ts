export enum SizeUnit {
  Centimeter = "cm",
  Inch = "in",
}

export const EPSILON = 0.00001;

const INCH_IN_CENTIMETER = 1 / 2.54;
const INCH_IN_CENTIMETER_SQR = INCH_IN_CENTIMETER * INCH_IN_CENTIMETER;

type OptimisationSettingsArgs = {
  minDistanceInCentimeters: number;
  minSimplifyAreaInCentimeters: number;
  minSegmentLengthInCentimeters: number;
};

class OptimisationSettings {
  constructor({
    minDistanceInCentimeters,
    minSimplifyAreaInCentimeters,
    minSegmentLengthInCentimeters,
  }: OptimisationSettingsArgs) {
    this.cm = {
      minDistance: minDistanceInCentimeters,
      minDistanceSqr: minDistanceInCentimeters ** 2,
      minSimplifyArea: minSimplifyAreaInCentimeters,
      maxSegmentLength: minSegmentLengthInCentimeters,
      convertToCentimetersScale: 1,
    };

    const minDistanceInInches = minDistanceInCentimeters * INCH_IN_CENTIMETER;
    const minSimplefyAreaInInches =
      minSimplifyAreaInCentimeters * INCH_IN_CENTIMETER_SQR;
    const minSegmentLengthInInches =
      minSegmentLengthInCentimeters * INCH_IN_CENTIMETER;

    this.in = {
      minDistance: minDistanceInInches,
      minDistanceSqr: minDistanceInInches ** 2,
      minSimplifyArea: minSimplefyAreaInInches,
      maxSegmentLength: minSegmentLengthInInches,
      convertToCentimetersScale: INCH_IN_CENTIMETER,
    };
  }

  "cm": {
    minDistance: number;
    minDistanceSqr: number;
    minSimplifyArea: number;
    maxSegmentLength: number;
    convertToCentimetersScale: number;
  };

  "in": {
    minDistance: number;
    minDistanceSqr: number;
    minSimplifyArea: number;
    maxSegmentLength: number;
    convertToCentimetersScale: number;
  };
}

type SideOptimisationSettingsArgs = {
  minDistanceInCentimeters: number;
  minSimplifyAreaInCentimeters: number;
  minSegmentLengthInCentimeters: number;
  minSliceDistanceInCentimeters: number;
  layerStepInCentimeters: number;
  layerStepInInches: number;
};
class SideOptimisationSettings {
  constructor({
    minDistanceInCentimeters,
    minSimplifyAreaInCentimeters,
    minSegmentLengthInCentimeters,
    minSliceDistanceInCentimeters,
    layerStepInCentimeters,
    layerStepInInches,
  }: SideOptimisationSettingsArgs) {
    const os = new OptimisationSettings({
      minDistanceInCentimeters,
      minSimplifyAreaInCentimeters,
      minSegmentLengthInCentimeters,
    });

    this.cm = {
      ...os.cm,
      minSliceDistance: minSliceDistanceInCentimeters,
      layerStep: layerStepInCentimeters,
    };

    this.in = {
      ...os.in,
      minSliceDistance: minSliceDistanceInCentimeters * INCH_IN_CENTIMETER,
      layerStep: layerStepInInches,
    };
  }

  "cm": {
    minDistance: number;
    minDistanceSqr: number;
    minSimplifyArea: number;
    minSliceDistance: number;
    convertToCentimetersScale: number;
    layerStep: number;
  };

  "in": {
    minDistance: number;
    minDistanceSqr: number;
    minSimplifyArea: number;
    minSliceDistance: number;
    convertToCentimetersScale: number;
    layerStep: number;
  };
}

export const ProfileOptimisationSettings = new OptimisationSettings({
  minDistanceInCentimeters: 0.05,
  minSimplifyAreaInCentimeters: 0.04 ** 2,
  minSegmentLengthInCentimeters: 0.5,
});

export const SidePathOptimisationSettings = new SideOptimisationSettings({
  minDistanceInCentimeters: 0.05,
  minSimplifyAreaInCentimeters: 0.04 ** 2,
  minSegmentLengthInCentimeters: 0.5,
  minSliceDistanceInCentimeters: 0.1,
  layerStepInCentimeters: 0.1, // 1 mm
  layerStepInInches: 0.03125, // 1/32 inch
});

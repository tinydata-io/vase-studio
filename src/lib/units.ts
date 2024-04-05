export enum SizeUnit {
  Centimeter = "cm",
  Inch = "in",
}

const InchInCentimeter = 1 / 2.54;
const InchInCentimeterSqr = InchInCentimeter * InchInCentimeter;

class OptimisationSettings {
  constructor(
    minDistanceInCentimeters: number,
    minSimplifyAreaInCentimeters: number
  ) {
    this.cm = {
      minDistance: minDistanceInCentimeters,
      minDistanceSqr: minDistanceInCentimeters ** 2,
      minSimplifyArea: minSimplifyAreaInCentimeters,
      convertToCentimetersScale: 1,
    };

    const minDistanceInInches = minDistanceInCentimeters * InchInCentimeter;
    const minSimplefyAreaInInches =
      minSimplifyAreaInCentimeters * InchInCentimeterSqr;

    this.in = {
      minDistance: minDistanceInInches,
      minDistanceSqr: minDistanceInInches ** 2,
      minSimplifyArea: minSimplefyAreaInInches,
      convertToCentimetersScale: InchInCentimeter,
    };
  }

  "cm": {
    minDistance: number;
    minDistanceSqr: number;
    minSimplifyArea: number;
    convertToCentimetersScale: number;
  };

  "in": {
    minDistance: number;
    minDistanceSqr: number;
    minSimplifyArea: number;
    convertToCentimetersScale: number;
  };
}

class SideOptimisationSettings {
  constructor(
    minDistanceInCentimeters: number,
    minSimplifyAreaInCentimeters: number,
    minSliceDistanceInCentimeters: number
  ) {
    const os = new OptimisationSettings(
      minDistanceInCentimeters,
      minSimplifyAreaInCentimeters
    );

    this.cm = {
      ...os.cm,
      minSliceDistance: minSliceDistanceInCentimeters,
    };

    this.in = {
      ...os.in,
      minSliceDistance: minSliceDistanceInCentimeters * InchInCentimeter,
    };
  }

  "cm": {
    minDistance: number;
    minDistanceSqr: number;
    minSimplifyArea: number;
    minSliceDistance: number;
  };

  "in": {
    minDistance: number;
    minDistanceSqr: number;
    minSimplifyArea: number;
    minSliceDistance: number;
  };
}

export const ProfileOptimisationSettings = new OptimisationSettings(
  0.05,
  0.04 ** 2
);

export const SidePathOptimisationSettings = new SideOptimisationSettings(
  0.2,
  0.12 ** 2,
  0.1
);

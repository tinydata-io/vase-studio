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
    };

    const minDistanceInInches = minDistanceInCentimeters * InchInCentimeter;
    const minSimplefyAreaInInches =
      minSimplifyAreaInCentimeters * InchInCentimeterSqr;

    this.in = {
      minDistance: minDistanceInInches,
      minDistanceSqr: minDistanceInInches ** 2,
      minSimplifyArea: minSimplefyAreaInInches,
    };
  }

  "cm": {
    minDistance: number;
    minDistanceSqr: number;
    minSimplifyArea: number;
  };

  "in": {
    minDistance: number;
    minDistanceSqr: number;
    minSimplifyArea: number;
  };
}

export const ProfileOptimisationSettings = new OptimisationSettings(
  0.05,
  0.04 ** 2
);

export const SidePathOptimisationSettings = new OptimisationSettings(
  0.2,
  0.12 ** 2
);

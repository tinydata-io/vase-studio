export enum SizeUnit {
  Centimeter = "cm",
  Inch = "in",
}

export const minDistanceForUnit = (sizeUnit: SizeUnit): number => {
  switch (sizeUnit) {
    case SizeUnit.Centimeter:
      return 0.05;
    case SizeUnit.Inch:
      return 0.001968504; // 0.5 mm
  }
};

export const minSimplifyAreaForUnit = (sizeUnit: SizeUnit): number => {
  switch (sizeUnit) {
    case SizeUnit.Centimeter:
      return 0.02 ** 2;
    case SizeUnit.Inch:
      return 0.0007874016 ** 2; // 0.2 mm ^ 2
  }
};

export const convertToCentimetersScale = (unit: SizeUnit) => {
  switch (unit) {
    case SizeUnit.Centimeter:
      return 1;
    case SizeUnit.Inch:
      return 2.54;
  }
};

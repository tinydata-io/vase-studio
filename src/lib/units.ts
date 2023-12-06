export enum SizeUnit {
  Centimeter = "cm",
  Inch = "in",
}

export const minDistanceForUnit = (sizeUnit: SizeUnit): number => {
  switch (sizeUnit) {
    case SizeUnit.Centimeter:
      return 0.1;
    case SizeUnit.Inch:
      return 0.0393701; // 1 mm
  }
};

export const minSimplifyAreaForUnit = (sizeUnit: SizeUnit): number => {
  switch (sizeUnit) {
    case SizeUnit.Centimeter:
      return 0.12 ** 2;
    case SizeUnit.Inch:
      return 0.0472441; // 1.2 mm ^ 2
  }
};

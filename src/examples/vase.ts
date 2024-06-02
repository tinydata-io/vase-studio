import { Vase } from "@/lib/types";
import { SizeUnit } from "@/lib/units";

export enum Example {
  SampleVase = "Sample Vase",
  RealVase = "Real Vase",
  RealVase2 = "Real Vase 2",
  SquareVase = "Square Vase",
  BarrelVase = "Barrel Vase",
}

export const getExample = (model: Example): Vase => {
  switch (model) {
    case Example.SquareVase:
      return squareVase;
    case Example.BarrelVase:
      return barrelVase;
    case Example.RealVase:
      return realVase;
    case Example.RealVase2:
      return realVase2;
    case Example.SampleVase:
    default:
      return sampleVase;
  }
};

const sampleVase: Vase = {
  height: 10,
  sizeUnit: SizeUnit.Centimeter,
  thickness: 0,
  profile: {
    sections: 4,
    pointSets: [
      {
        offset: {
          value: 0,
        },
        count: 4,
        angleStart: 0,
        angleStep: 0.25,
      },
      {
        offset: {
          value: 0.5,
          weightIn: 1,
          weightOut: 1,
        },
        count: 4,
        angleStart: 0.125,
        angleStep: 0.25,
      },
      {
        offset: {
          value: -0.25,
        },
        count: 2,
        angleStart: 0.4,
        angleStep: 0.2,
      },
    ],
  },
  radius: {
    "0": { value: 3, weightIn: 1, weightOut: 1 },
    "0.3": { value: 4, weightIn: 0, weightOut: 0 },
    "0.5": { value: 4, weightIn: 0.5, weightOut: 0 },
    "0.8": { value: 2 },
    "1": { value: 3, weightIn: 0, weightOut: 1 },
  },
  rotation: {
    "0": { value: 0 },
    "0.2": { value: Math.PI * 0.125 },
    "0.8": { value: Math.PI * 0.875 },
    "1": { value: Math.PI },
  },
  intensity: {
    "0": { value: 0 },
    "0.3": { value: 1 },
    "0.7": { value: 1 },
    "0.9": { value: 0.2 },
    "0.97": { value: 0 },
    "1": { value: 0 },
  },
};

const realVase: Vase = {
  height: 15,
  sizeUnit: SizeUnit.Centimeter,
  thickness: 0,
  profile: {
    sections: 32,
    pointSets: [
      {
        offset: {
          value: 0,
        },
        count: 1,
        angleStart: 0,
        angleStep: 0,
      },
      {
        offset: {
          value: 0.3,
          weightIn: 1,
          weightOut: 1,
        },
        count: 1,
        angleStart: 0.5,
        angleStep: 0,
      },
    ],
  },
  radius: {
    "0": { value: 2.5 },
    "0.3": { value: 3 },
    "0.6": { value: 2 },
    "0.8": { value: 1.4 },
    "1": { value: 1.5 },
  },
  rotation: {
    "0": { value: 0 },
    "0.3": { value: Math.PI * 0.125 },
    "0.7": { value: Math.PI * 0.875 },
    "1": { value: Math.PI },
  },
  intensity: {
    "0": { value: 0 },
    "0.3": { value: 1 },
    "0.7": { value: 0.3 },
    "1": { value: 0 },
  },
};

const realVase2: Vase = {
  height: 13,
  sizeUnit: SizeUnit.Centimeter,
  thickness: 0,
  profile: {
    sections: 12,
    pointSets: [
      {
        offset: {
          value: 0,
        },
        count: 1,
        angleStart: 0,
        angleStep: 0,
      },
      {
        offset: {
          value: 0,
          weightOut: 1,
        },
        count: 1,
        angleStart: 0.44,
        angleStep: 0,
      },
      {
        offset: {
          value: 0,
          weightIn: 1,
        },
        count: 1,
        angleStart: 0.56,
        angleStep: 0,
      },
      {
        offset: {
          value: -0.3,
          weightIn: 1,
          weightOut: 1,
        },
        count: 2,
        angleStart: 0.45,
        angleStep: 0.1,
      },
      {
        offset: {
          value: 0,
        },
        count: 2,
        angleStart: 0.25,
        angleStep: 0.5,
      },
    ],
  },
  radius: {
    "0": { value: 2.5 },
    "0.3": { value: 3 },
    "0.6": { value: 2 },
    "0.8": { value: 1.4 },
    "1": { value: 1.5 },
  },
  rotation: {
    "0": { value: 0 },
    "0.2": { value: Math.PI * 0.25 },
    "0.8": { value: Math.PI * 1.25 },
    "1": { value: Math.PI * 1.5 },
  },
  intensity: {
    "0": { value: 0 },
    "0.3": { value: 1 },
    "0.9": { value: 0.3 },
    "1": { value: 0 },
  },
};

const squareVase: Vase = {
  height: 10,
  sizeUnit: SizeUnit.Centimeter,
  thickness: 0,
  profile: {
    sections: 4,
    pointSets: [
      {
        offset: {
          value: 0,
        },
        count: 1,
        angleStart: 0,
        angleStep: 1,
      },
    ],
  },
  radius: {
    "0": { value: 3, weightIn: 1, weightOut: 1 },
    "1": { value: 3, weightIn: 1, weightOut: 1 },
  },
  rotation: {
    "0": { value: 0, weightIn: 1, weightOut: 1 },
    "1": { value: -1.5707963267948966, weightIn: 1, weightOut: 1 },
  },
  intensity: {
    "0": { value: 0, weightIn: 1, weightOut: 1 },
    "1": { value: 0, weightIn: 1, weightOut: 1 },
  },
};

const barrelVase: Vase = {
  height: 10,
  sizeUnit: SizeUnit.Centimeter,
  thickness: 0,
  profile: {
    sections: 8,
    pointSets: [
      {
        offset: {
          value: 0,
        },
        count: 4,
        angleStart: 0,
        angleStep: 0.25,
      },
    ],
  },
  radius: {
    "0": { value: 3 },
    "0.5": { value: 4 },
    "1": { value: 3 },
  },
  rotation: {
    "0": { value: 0, weightIn: 1, weightOut: 1 },
    "1": { value: Math.PI * -0.5, weightIn: 1, weightOut: 1 },
  },
  intensity: {
    "0": { value: 0, weightIn: 1, weightOut: 1 },
    "1": { value: 0, weightIn: 1, weightOut: 1 },
  },
};

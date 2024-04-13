import { Vase } from "@/lib/types";
import { SizeUnit } from "@/lib/units";

export enum Example {
  SampleVase = "Sample Vase",
  SquareVase = "Square Vase",
  BarrelVase = "Barrel Vase",
}

export const getExample = (model: Example): Vase => {
  switch (model) {
    case Example.SquareVase:
      return squareVase;
    case Example.BarrelVase:
      return barrelVase;
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
  slices: [
    {
      position: 0,
      radius: { value: 3, weightIn: 1, weightOut: 1 },
      rotation: { value: 0 },
      intensity: { value: 0 },
    },
    {
      position: 0.1,
      radius: { value: 5, weightIn: 1, weightOut: 1 },
      rotation: { value: 0 },
      intensity: { value: 1 },
    },
    {
      position: 0.4,
      radius: { value: 5, weightIn: 0.5, weightOut: 0 },
    },
    {
      position: 0.6,
      rotation: { value: Math.PI / 2 },
    },
    {
      position: 0.7,
      intensity: { value: 1 },
    },
    {
      position: 0.8,
      radius: { value: 2 },
    },
    {
      position: 0.9,
      rotation: { value: Math.PI * 1.0 },
    },
    {
      position: 1.0,
      radius: { value: 3, weightIn: 0, weightOut: 1 },
      rotation: { value: Math.PI * 1.5 },
      intensity: { value: 0 },
    },
  ],
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
  slices: [
    {
      position: 0,
      radius: { value: 3, weightIn: 1, weightOut: 1 },
      rotation: { value: 0, weightIn: 1, weightOut: 1 },
      intensity: { value: 0, weightIn: 1, weightOut: 1 },
    },
    {
      position: 1,
      radius: { value: 3, weightIn: 1, weightOut: 1 },
      rotation: { value: -Math.PI / 2, weightIn: 1, weightOut: 1 },
      intensity: { value: 0, weightIn: 1, weightOut: 1 },
    },
  ],
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
  slices: [
    {
      position: 0,
      radius: { value: 3 },
      rotation: { value: 0, weightIn: 1, weightOut: 1 },
      intensity: { value: 0, weightIn: 1, weightOut: 1 },
    },
    {
      position: 0.5,
      radius: { value: 4 },
    },
    {
      position: 1,
      radius: { value: 3 },
      rotation: { value: -Math.PI / 2, weightIn: 1, weightOut: 1 },
      intensity: { value: 0, weightIn: 1, weightOut: 1 },
    },
  ],
};

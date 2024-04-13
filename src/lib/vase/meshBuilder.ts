import { ModelSlice } from "./vase";

export type Vec3 = {
  x: number;
  y: number;
  z: number;
};

export type Triangle = {
  a: Vec3;
  b: Vec3;
  c: Vec3;
};

export type TriangleWithNormal = {
  a: Vec3;
  b: Vec3;
  c: Vec3;
  n: Vec3;
};

export type AABB = {
  min: Vec3;
  max: Vec3;
};

type TransformedSlice = {
  external: Vec3[];
  originalAngles: number[];
};

export const getTriangleCenter = (t: Triangle): Vec3 => {
  return {
    x: (t.a.x + t.b.x + t.c.x) / 3,
    y: (t.a.y + t.b.y + t.c.y) / 3,
    z: (t.a.z + t.b.z + t.c.z) / 3,
  };
};

export const getTriangleNormal = (t: Triangle): Vec3 => {
  // https://www.khronos.org/opengl/wiki/Calculating_a_Surface_Normal
  const [ax, ay, az] = [t.b.x - t.a.x, t.b.y - t.a.y, t.b.z - t.a.z];
  const [bx, by, bz] = [t.c.x - t.a.x, t.c.y - t.a.y, t.c.z - t.a.z];

  const v = {
    x: ay * bz - az * by,
    y: az * bx - ax * bz,
    z: ax * by - ay * bx,
  };

  const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length,
  };
};

export class Mesh {
  triangles: TriangleWithNormal[];
  aabb: AABB;

  constructor(triangles: TriangleWithNormal[], aabb: AABB) {
    this.triangles = triangles;
    this.aabb = aabb;
  }
}

export class MeshBuilder {
  triangles: Triangle[];

  constructor() {
    this.triangles = [];
  }

  addTriangle(a: Vec3, b: Vec3, c: Vec3) {
    this.triangles.push({ a, b, c });
  }

  triangulateBase(slice: ModelSlice) {
    const center = { x: 0, y: slice.y, z: 0 };

    for (let i = 0; i < slice.external.length; i++) {
      const sa = slice.external[i];
      const sb = slice.external[(i + 1) % slice.external.length];

      const a = { x: sa.x, y: slice.y, z: sa.y };
      const b = { x: sb.x, y: slice.y, z: sb.y };

      this.addTriangle(a, center, b);
    }
  }

  connectSlices(a: TransformedSlice, b: TransformedSlice) {
    let ai = 0;
    let bi = 0;

    // temporary triangle format, will be used for quad identification and mesh optimization
    type InterimTriangle = {
      nai: number;
      nbi: number;
      a: { s: Vec3[]; i: number };
      b: { s: Vec3[]; i: number };
      c: { s: Vec3[]; i: number };
    };

    const triangles: InterimTriangle[] = [];
    const lenA = a.external.length;
    const lenB = b.external.length;

    // iterate over slices twice to build full triangulation, break as soon as the first triangle is found again
    while (ai < 2 * a.external.length && bi < 2 * b.external.length) {
      // originalAngle is -PI to PI, on second iteration we need to add 2PI to the angle to be continuous
      const angleA =
        a.originalAngles[ai % lenA] + (ai >= lenA ? 2 * Math.PI : 0);

      const angleB =
        b.originalAngles[bi % lenB] + (bi >= lenB ? 2 * Math.PI : 0);

      const nai = ai % lenA;
      const nbi = bi % lenB;

      if (
        triangles.length > 0 &&
        triangles[0].nai == nai &&
        triangles[0].nbi == nbi
      ) {
        // got back to the first triangle, can safely break
        break;
      }

      if (angleA < angleB) {
        if (ai > 0 && bi > 0) {
          triangles.push({
            nai,
            nbi,
            a: { s: a.external, i: ai % lenA },
            b: { s: b.external, i: (bi - 1) % lenB },
            c: { s: a.external, i: (ai - 1) % lenA },
          });
        }
        ai++;
      } else {
        if (ai > 0 && bi > 0) {
          triangles.push({
            nai,
            nbi,
            a: { s: b.external, i: bi % lenB },
            b: { s: b.external, i: (bi - 1) % lenB },
            c: { s: a.external, i: (ai - 1) % lenA },
          });
        }
        bi++;
      }
    }

    triangles.forEach((t) => {
      const pa = t.a.s[t.a.i];
      const pb = t.b.s[t.b.i];
      const pc = t.c.s[t.c.i];

      this.addTriangle(pa, pb, pc);
    });
  }

  triangulateSlices(slices: ModelSlice[]) {
    const transformedSlices = slices.map((slice) => {
      const external = slice.external.map((p) => ({
        x: p.x,
        y: slice.y, // temporary
        z: p.y,
      }));

      return {
        external,
        originalAngles: slice.originalAngles,
      };
    });

    for (let i = 1; i < transformedSlices.length; i++) {
      this.connectSlices(transformedSlices[i - 1], transformedSlices[i]);
    }
  }

  build(): Mesh {
    const trianglesWithNormals = this.triangles.map((t) => ({
      a: t.a,
      b: t.b,
      c: t.c,
      n: getTriangleNormal(t),
    }));

    const aabb = this.triangles.reduce(
      (acc, t) => {
        return {
          min: {
            x: Math.min(acc.min.x, t.a.x, t.b.x, t.c.x),
            y: Math.min(acc.min.y, t.a.y, t.b.y, t.c.y),
            z: Math.min(acc.min.z, t.a.z, t.b.z, t.c.z),
          },
          max: {
            x: Math.max(acc.max.x, t.a.x, t.b.x, t.c.x),
            y: Math.max(acc.max.y, t.a.y, t.b.y, t.c.y),
            z: Math.max(acc.max.z, t.a.z, t.b.z, t.c.z),
          },
        };
      },
      {
        min: { x: Infinity, y: Infinity, z: Infinity },
        max: { x: -Infinity, y: -Infinity, z: -Infinity },
      }
    );

    return new Mesh(trianglesWithNormals, aabb);
  }
}

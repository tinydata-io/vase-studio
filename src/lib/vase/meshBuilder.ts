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

export enum TrianglesPerQuad {
  Two = "Two",
  Four = "Four",
}

export class MeshBuilder {
  triangles: Triangle[];
  trianglesPerQuad: TrianglesPerQuad;

  constructor(trianglesPerQuad: TrianglesPerQuad = TrianglesPerQuad.Two) {
    this.triangles = [];
    this.trianglesPerQuad = trianglesPerQuad;
  }

  addTriangle(a: Vec3, b: Vec3, c: Vec3) {
    this.triangles.push({ a, b, c });
  }

  triangulateSlice(
    slice: ModelSlice,
    addTriangle: (a: Vec3, b: Vec3, c: Vec3) => void
  ) {
    const center = { x: 0, y: slice.y, z: 0 };

    for (let i = 0; i < slice.external.length; i++) {
      const sa = slice.external[i];
      const sb = slice.external[(i + 1) % slice.external.length];

      const a = { x: sa.x, y: slice.y, z: sa.y };
      const b = { x: sb.x, y: slice.y, z: sb.y };

      addTriangle(a, center, b);
    }
  }

  triangulateBase(slice: ModelSlice) {
    this.triangulateSlice(slice, (a, b, c) => this.addTriangle(c, b, a));
  }

  triangulateTop(slice: ModelSlice) {
    this.triangulateSlice(slice, (a, b, c) => this.addTriangle(a, b, c));
  }

  connectSlices(a: Vec3[], b: Vec3[]) {
    for (let i = 0; i < a.length; i++) {
      const sa = a[i];
      const sb = a[(i + 1) % a.length];

      const sc = b[i];
      const sd = b[(i + 1) % b.length];

      if (this.trianglesPerQuad === TrianglesPerQuad.Four) {
        // quad center
        const se = {
          x: (sa.x + sb.x + sc.x + sd.x) / 4,
          y: (sa.y + sb.y + sc.y + sd.y) / 4,
          z: (sa.z + sb.z + sc.z + sd.z) / 4,
        };

        this.addTriangle(sa, sb, se);
        this.addTriangle(sb, sd, se);
        this.addTriangle(sd, sc, se);
        this.addTriangle(sc, sa, se);
      } else {
        this.addTriangle(sa, sb, sc);
        this.addTriangle(sc, sb, sd);
      }
    }
  }

  triangulateSlices(slices: ModelSlice[]) {
    const transformedSlices = slices.map((slice) => {
      return slice.external.map((p) => ({
        x: p.x,
        y: slice.y,
        z: p.y,
      }));
    });

    let prevTransformedSlice = transformedSlices[0];

    for (let i = 1; i < transformedSlices.length; i++) {
      const transformedSlice = transformedSlices[i];
      this.connectSlices(prevTransformedSlice, transformedSlice);

      prevTransformedSlice = transformedSlice;
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

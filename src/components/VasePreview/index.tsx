import { Vec2, add, left, normalised, rotate, sub } from "@/lib/math2d";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SizeUnit, convertToCentimetersScale } from "@/lib/units";

import { NormalsHelper } from "./helpers";

type VasePreviewProps = {
  unit: SizeUnit;
  height: number;
  profilePoints: Vec2[];
  profileMaxRadius: number;
  rotations: number;
};

export const VasePreview = ({
  profilePoints,
  unit,
  height,
  profileMaxRadius,
  rotations,
}: VasePreviewProps) => {
  const points = useMemo<Vec2[]>(() => {
    const scale = convertToCentimetersScale(unit);
    return profilePoints.map((p) => {
      return {
        x: p.x * scale,
        y: p.y * scale,
      };
    });
  }, [profilePoints, unit]);

  const rotation = rotations * Math.PI * 2;

  // border is temporary to show the size of the canvas
  return (
    <div className="border-dashed border-gray-300 border-2 h-full aspect-square">
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <pointLight position={[-5, 30, -30]} decay={0} intensity={Math.PI} />
        <Vase
          profilePoints={points}
          height={height}
          maxRadius={profileMaxRadius}
          rotation={rotation}
        />
      </Canvas>
    </div>
  );
};

type VaseProps = {
  profilePoints: Vec2[];
  height: number;
  maxRadius: number;
  rotation: number;
};

const Vase = ({ profilePoints, height, rotation }: VaseProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useThree(({ camera }) => {
    camera.position.x = 0;
    camera.position.y = 12;
    camera.position.z = -10;
    camera.lookAt(new THREE.Vector3(0, 5, 0));
  });

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // TODO: dynamic layers calculation based on side profiel shape
  const layers = Math.round(height * 2); // every 5 mm
  const layerStep = height / layers;

  let vertices = 0;
  const rawVertices: number[] = [];
  const rawNormals: number[] = [];
  const indices: number[] = [];

  const addVertex = function (
    x: number,
    y: number,
    z: number,
    nx: number,
    ny: number,
    nz: number
  ) {
    rawVertices.push(x, y, z);
    rawNormals.push(nx, ny, nz);
    return vertices++;
  };

  const getLayerProfile = function (y: number) {
    const p = y / height;
    const layerRotation = p * rotation;

    return profilePoints.map((p) => {
      const sinAngle = Math.sin(layerRotation);
      const cosAngle = Math.cos(layerRotation);
      const rotated = rotate(p, cosAngle, sinAngle);

      return {
        x: rotated.x,
        y: rotated.y,
      };
    });
  };

  const getNormals = function (profile: Vec2[]) {
    const normals: Vec2[] = [];

    for (let i = 0; i < profile.length; i++) {
      const curr = profile[i];
      const prev = profile[(i - 1 + profile.length) % profile.length];
      const next = profile[(i + 1) % profile.length];

      const nPrevDir = left(normalised(sub(curr, prev)));
      const nNextDir = left(normalised(sub(next, curr)));

      // rotate 90 degrees
      //   const normal = {
      //     x: -d.y,
      //     y: d.x,
      //   };

      const d = normalised(add(nPrevDir, nNextDir));

      const normal = {
        x: d.x,
        y: d.y,
      };

      normals.push(normal);
    }

    return normals;
  };

  let currentLayerIndices: number[] = [];
  let previousLayerIndices: number[] = [];
  const normals = [];

  for (let layer = 0; layer < layers; layer++) {
    const y = layer * layerStep;

    currentLayerIndices = [];
    const layerProfile = getLayerProfile(y);
    const layerNormals = getNormals(layerProfile);

    for (let i = 0; i < profilePoints.length; i++) {
      const p = layerProfile[i];
      const n = layerNormals[i];

      currentLayerIndices.push(addVertex(p.x, y, p.y, n.x, 0, n.y));

      const pv = new THREE.Vector3(p.x, y, p.y);
      const pn = new THREE.Vector3(n.x, 0, n.y);

      normals.push([pv, pn]);
    }

    // triangulate base
    if (layer == 0) {
      const centerId = addVertex(0, y, 0, 0, -1, 0);

      for (let i = 0; i < currentLayerIndices.length; i++) {
        indices.push(
          currentLayerIndices[i],
          centerId,
          currentLayerIndices[(i + 1) % currentLayerIndices.length]
        );
      }
    } // triangulate slice
    else {
      for (let i = 0; i < currentLayerIndices.length; i++) {
        const a = i;
        const b = (i + 1) % currentLayerIndices.length;

        indices.push(
          currentLayerIndices[a],
          previousLayerIndices[a],
          currentLayerIndices[b]
        );
        indices.push(
          currentLayerIndices[b],
          previousLayerIndices[a],
          previousLayerIndices[b]
        );
      }
    }

    previousLayerIndices = currentLayerIndices;
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setIndex(indices);
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(rawVertices, 3)
  );

  geometry.setAttribute(
    "normal",
    new THREE.Float32BufferAttribute(rawNormals, 3)
  );

  //geometry.computeVertexNormals();

  console.log(meshRef);
  console.log(meshRef.current);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 2,
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]} geometry={geometry}>
        <meshStandardMaterial color="#4682b4" side={THREE.DoubleSide} />
      </mesh>
      {false &&
        normals.map(([p1, n], index) => {
          const scale = 0.5;
          const p2 = new THREE.Vector3(
            p1.x + scale * n.x,
            p1.y + scale * n.y,
            p1.z + scale * n.z
          );

          const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);

          return (
            <line key={index} geometry={geometry} material={lineMaterial} />
          );
        })}
    </>
  );
};

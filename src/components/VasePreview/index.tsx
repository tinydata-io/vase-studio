"use client";

import { Vec2, rotate } from "@/lib/math2d";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Outline,
  Selection,
  Select,
  Noise,
} from "@react-three/postprocessing";

import { BlendFunction, Resolution, KernelSize } from "postprocessing";

import { useMemo, useRef } from "react";
import * as THREE from "three";

import { Vase } from "@/lib/types";
import { generateProfile } from "@/components/SimpleProfile/util";

import { getRotation, getRadius, getIntensity } from "@/lib/vase/slices";

type VasePreviewProps = {
  vase: Vase;
};

type ModelSlice = {
  y: number;
  external: Vec2[];
};

const findCorrespondingSlices = function (vs: Vec2[], y: number) {
  let prev = undefined;

  for (let i = 0; i < vs.length; i++) {
    const v = vs[i];

    if (v.y >= y) {
      return [prev, v];
    }

    prev = v;
  }

  return [prev, undefined];
};

const interpolate = function (y: number, ps?: Vec2, ns?: Vec2): number {
  if (!ps) {
    return ns!.x;
  }

  if (!ns) {
    return ps.x;
  }

  const t = (y - ps.y) / (ns.y - ps.y);
  return ps.x + t * (ns.x - ps.x);
};

const getVaseModelSlices = (vase: Vase): ModelSlice[] => {
  const result = Array<ModelSlice>();

  const rotationSlices = getRotation(vase.slices, vase.height, vase.sizeUnit);
  const radiusSlices = getRadius(vase.slices, vase.height, vase.sizeUnit);
  const intensitySlices = getIntensity(vase.slices, vase.height, vase.sizeUnit);

  let ys = [
    ...rotationSlices.map((s) => s.y),
    ...radiusSlices.map((s) => s.y),
    ...intensitySlices.map((s) => s.y),
  ];

  ys.sort();

  let prevY = -1;

  for (const y of ys) {
    if (y === prevY) {
      continue;
    }

    const [prevR, nextR] = findCorrespondingSlices(radiusSlices, y);
    const [prevI, nextI] = findCorrespondingSlices(intensitySlices, y);
    const [prevRot, nextRot] = findCorrespondingSlices(rotationSlices, y);

    const radius = interpolate(y, prevR, nextR);
    const intensity = interpolate(y, prevI, nextI);
    const rotation = interpolate(y, prevRot, nextRot);

    const profile = generateProfile(
      radius,
      vase.sizeUnit,
      vase.profile,
      intensity
    );

    const sinAngle = Math.sin(rotation);
    const cosAngle = Math.cos(rotation);

    const slicePoints = profile.curvePoints.map((p) =>
      rotate(p, sinAngle, cosAngle)
    );

    result.push({
      y: y,
      external: slicePoints,
    });

    prevY = y;
  }

  return result;
};

export const VasePreview = ({ vase }: VasePreviewProps) => {
  const profileMaxRadius = useMemo<number>(() => {
    return vase.slices.reduce((max, s) => {
      return s.radius === undefined ? max : Math.max(max, s.radius.value);
    }, 0);
  }, [vase.slices]);

  const slices: ModelSlice[] = getVaseModelSlices(vase);

  // border is temporary to show the size of the canvas
  return (
    <div className="border-dashed border-gray-300 border-2 h-full aspect-square">
      <Canvas shadows>
        <ambientLight intensity={Math.PI / 2} />

        <VaseComponent
          maxRadius={profileMaxRadius}
          height={vase.height}
          slices={slices}
        />
        <fog attach="fog" color="white" near={30} far={40} />
      </Canvas>
    </div>
  );
};

type VaseProps = {
  slices: Array<ModelSlice>;
  height: number; // for camera positioning
  maxRadius: number; // for camera positioning
};

const VaseComponent = ({ slices, height }: VaseProps) => {
  const mainMeshRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.DirectionalLight>(null!);

  const meshRefs = [mainMeshRef];

  const state = useThree(({ camera }) => {
    camera.position.x = 0;
    camera.position.y = 12;
    camera.position.z = -10;
    camera.lookAt(new THREE.Vector3(0, 5, 0));
  });

  useFrame((state, delta) => {
    meshRefs.forEach((meshRef) => {
      if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.2;
      }
    });

    const gl = state.gl.getContext();

    if (lightRef.current) {
      lightRef.current.shadow.mapSize.width = 512;
      lightRef.current.shadow.mapSize.height = 512;
      lightRef.current.shadow.camera.near = 0.5;
      lightRef.current.shadow.camera.far = 200;
      lightRef.current.shadow.camera.left = -10;
      lightRef.current.shadow.camera.right = 10;
      lightRef.current.shadow.camera.top = 10;
      lightRef.current.shadow.camera.bottom = -10;
      lightRef.current.shadow.radius = 16;
      lightRef.current.shadow.blurSamples = 32;
    }
  });

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

  for (const slice of slices) {
    // random normals to better see slices
    const nx = Math.random() * 8 - 4;
    const ny = Math.random() * 8 - 4;
    const nz = Math.random() * 8 - 4;

    const centerId = addVertex(0, slice.y, 0, nx, ny, nz);

    // for now just draw triangulated slice profile
    for (let i = 0; i < slice.external.length; i++) {
      const cp = slice.external[i];
      const np = slice.external[(i + 1) % slice.external.length];

      indices.push(
        addVertex(cp.x, slice.y, cp.y, nx, ny, nz),
        centerId,
        addVertex(np.x, slice.y, np.y, nx, ny, nz)
      );
    }
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

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[-20, 45, -10]}
        intensity={Math.PI}
        castShadow
      />
      <Selection enabled={true}>
        <Select enabled={true}>
          <mesh
            ref={mainMeshRef}
            position={[0, 0, 0]}
            geometry={geometry}
            castShadow
          >
            <meshPhysicalMaterial color="#4682b4" side={THREE.DoubleSide} />
          </mesh>
        </Select>
        <mesh position={[0, -0.1, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[100]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <EffectComposer autoClear={false} multisampling={0}>
          <Outline
            blendFunction={BlendFunction.ALPHA} // set this to BlendFunction.ALPHA for dark outlines
            edgeStrength={8} // the edge strength
            visibleEdgeColor={0x000000} // the color of visible edges
            hiddenEdgeColor={0xff0000} // the color of hidden edges
            width={Resolution.AUTO_SIZE} // render width
            height={Resolution.AUTO_SIZE} // render height
            kernelSize={KernelSize.VERY_SMALL} // blur kernel size
            blur={true} // whether the outline should be blurred
          />
          <Noise
            premultiply // enables or disables noise premultiplication
            blendFunction={BlendFunction.ADD} // blend mode
            opacity={0.2} // noise opacity level
          />
        </EffectComposer>
      </Selection>
    </>
  );
};

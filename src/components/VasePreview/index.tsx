"use client";

import { Vec2, add, left, normalised, rotate, sub } from "@/lib/math2d";
import {
  Canvas,
  useFrame,
  useThree,
  extend,
  Object3DNode,
} from "@react-three/fiber";
import {
  EffectComposer,
  Outline,
  Selection,
  Select,
  SMAA,
  Noise,
} from "@react-three/postprocessing";

import { BlendFunction, Resolution, KernelSize } from "postprocessing";

import { useMemo, useRef } from "react";
import * as THREE from "three";

import { convertToCentimetersScale } from "@/lib/units";
import { Vase } from "@/lib/types";
import { GeneratedProfile } from "@/components/SimpleProfile/types";
import { generateProfile } from "@/components/SimpleProfile/util";

type VasePreviewProps = {
  vase: Vase;
};

export const VasePreview = ({ vase }: VasePreviewProps) => {
  const generatedProfile = useMemo<GeneratedProfile>(() => {
    const radius = vase.slices[0].radius.value;
    return generateProfile(radius, vase.sizeUnit, vase.profile);
  }, [vase]);

  const points = useMemo<Vec2[]>(() => {
    const scale = convertToCentimetersScale(vase.sizeUnit);
    return generatedProfile.curvePoints.map((p) => {
      return {
        x: p.x * scale,
        y: p.y * scale,
      };
    });
  }, [vase.sizeUnit, generatedProfile.curvePoints]);

  const profileMaxRadius = useMemo<number>(() => {
    return vase.slices.reduce((max, s) => {
      return Math.max(max, s.radius.value);
    }, 0);
  }, [vase.slices]);

  // TODO
  const rotation = 0.2 * Math.PI * 2;

  // camera.position.x = 0;
  // camera.position.y = 12;
  // camera.position.z = -10;
  // camera.lookAt(new THREE.Vector3(0, 5, 0));

  // border is temporary to show the size of the canvas
  return (
    <div className="border-dashed border-gray-300 border-2 h-full aspect-square">
      <Canvas shadows>
        <ambientLight intensity={Math.PI / 2} />

        <VaseComponent
          profilePoints={points}
          height={vase.height}
          maxRadius={profileMaxRadius}
          rotation={rotation}
        />
        <fog attach="fog" color="white" near={30} far={40} />
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

const VaseComponent = ({ profilePoints, height, rotation }: VaseProps) => {
  const mainMeshRef = useRef<THREE.Mesh>(null!);
  const wireframeMeshRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.DirectionalLight>(null!);

  const meshRefs = [mainMeshRef, wireframeMeshRef];

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
    const layerScale = Math.sin(p * 6) / 4 + 0.75;

    return profilePoints.map((p) => {
      const sinAngle = Math.sin(layerRotation);
      const cosAngle = Math.cos(layerRotation);
      const rotated = rotate(p, cosAngle, sinAngle);

      return {
        x: rotated.x * layerScale,
        y: rotated.y * layerScale,
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

      const d = normalised(add(nPrevDir, nNextDir));

      const normal = {
        x: d.x,
        y: d.y,
      };

      normals.push(normal);
    }

    return normals;
  };

  console.time("generation");

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

  console.timeEnd("generation");

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

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 2,
  });

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
          {/* <mesh
            ref={wireframeMeshRef}
            position={[0, 0, -0.02]}
            geometry={geometry}
          >
            <meshStandardMaterial
              color="#000000"
              wireframe={true}
              side={THREE.DoubleSide}
              transparent={true}
              opacity={0.05}
              depthWrite={false}
            />
          </mesh> */}
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

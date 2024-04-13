"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Outline,
  Selection,
  Select,
  Noise,
} from "@react-three/postprocessing";

import { BlendFunction, Resolution, KernelSize } from "postprocessing";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { Stats, OrbitControls } from "@react-three/drei";

import { Mesh, TriangleWithNormal, Vec3 } from "@/lib/vase/meshBuilder";

export type MeshPreviewProps = {
  mesh: Mesh;
  cameraPosition: Vec3;
  cameraLookAt: Vec3;
  meshRotation: number;
  showModel: boolean;
  showWireframe?: boolean;
  showNormals?: boolean;
  orbitControls?: boolean;
  showStats?: boolean;
};

export const MeshPreview = ({
  mesh,
  cameraPosition,
  cameraLookAt,
  meshRotation,
  showModel,
  showWireframe,
  showNormals,
  orbitControls,
  showStats,
}: MeshPreviewProps) => {
  // border is temporary to show the size of the canvas
  return (
    <div className="border-dashed border-gray-300 border-2 h-full aspect-square">
      <Canvas shadows frameloop="demand">
        <ambientLight intensity={Math.PI / 2} />

        <VaseComponent
          mesh={mesh}
          cameraPosition={cameraPosition}
          cameraLookAt={cameraLookAt}
          meshRotation={meshRotation}
          showModel={showModel}
          showWireframe={showWireframe}
          showNormals={showNormals}
        />

        <fog attach="fog" color="white" near={30} far={40} />
        {orbitControls && <OrbitControls />}
        {showStats && <Stats />}
      </Canvas>
    </div>
  );
};

type VaseProps = {
  mesh: Mesh;
  cameraPosition: Vec3;
  cameraLookAt: Vec3;
  meshRotation: number;
  showModel: boolean;
  showWireframe?: boolean;
  showNormals?: boolean;
};

const buildGeometry = (mesh: Mesh) => {
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

  const addTriangle = function (t: TriangleWithNormal) {
    indices.push(
      addVertex(t.a.x, t.a.y, t.a.z, t.n.x, t.n.y, t.n.z),
      addVertex(t.b.x, t.b.y, t.b.z, t.n.x, t.n.y, t.n.z),
      addVertex(t.c.x, t.c.y, t.c.z, t.n.x, t.n.y, t.n.z)
    );
  };

  mesh.triangles.forEach(addTriangle);

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

  return geometry;
};

const VaseComponent = ({
  mesh,
  cameraPosition,
  cameraLookAt,
  meshRotation,
  showModel,
  showWireframe,
}: VaseProps) => {
  const mainMeshRef = useRef<THREE.Mesh>(null!);
  const wireframeMeshRef = useRef<THREE.Mesh>(null!);

  const lightRef = useRef<THREE.DirectionalLight>(null!);

  useThree((state) => {
    state.camera.position.x = cameraPosition.x;
    state.camera.position.y = cameraPosition.y;
    state.camera.position.z = cameraPosition.z;

    state.camera.lookAt(
      new THREE.Vector3(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z)
    );
  });

  useEffect(() => {
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
  }, [lightRef]);

  const geometry = useMemo(() => buildGeometry(mesh), [mesh]);

  useEffect(() => {
    const meshRefs = [mainMeshRef, wireframeMeshRef];

    meshRefs.forEach((meshRef) => {
      if (meshRef.current) {
        meshRef.current.rotation.y = meshRotation;
      }
    });
  }, [mainMeshRef, wireframeMeshRef, meshRotation]);

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
          {showModel && (
            <mesh
              ref={mainMeshRef}
              position={[0, 0, 0]}
              geometry={geometry}
              castShadow
            >
              <meshPhysicalMaterial color="#4682b4" side={THREE.DoubleSide} />
            </mesh>
          )}
        </Select>
        <mesh position={[0, -0.1, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[100]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {showWireframe && (
          <mesh
            ref={wireframeMeshRef}
            position={[0, 0, -0.02]}
            geometry={geometry}
          >
            <meshStandardMaterial
              color="#000000"
              wireframe={true}
              side={THREE.DoubleSide}
              transparent={true}
              opacity={1.0}
              depthWrite={false}
            />
          </mesh>
        )}
        <EffectComposer autoClear={false} multisampling={0}>
          <Noise
            premultiply // enables or disables noise premultiplication
            blendFunction={BlendFunction.ADD} // blend mode
            opacity={0.5} // noise opacity level
          />
        </EffectComposer>
      </Selection>
    </>
  );
};

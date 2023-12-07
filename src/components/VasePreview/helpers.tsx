import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { VertexNormalsHelper } from "three-stdlib";
import * as THREE from "three";

extend({ VertexNormalsHelper });

type NormalsHelperProps = {
  object: THREE.Mesh;
};

export function NormalsHelper({ object }: NormalsHelperProps) {
  console.log("NormalsHelper");
  const helper: any = useRef();
  useFrame(() => {
    if (helper.current) {
      helper.current.update();
    }
  });

  return (
    object && (
      <primitive
        object={new VertexNormalsHelper(object, 2, 0x00ff00)}
        ref={helper}
      />
    )
  );
}

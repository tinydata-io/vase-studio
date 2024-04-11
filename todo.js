// animation

//  const targetFPS = 60;

//   // find better frame limitting loop
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const delta = state.clock.getDelta();
//       const meshRefs = [mainMeshRef, wireframeMeshRef];

//       meshRefs.forEach((meshRef) => {
//         if (meshRef.current) {
//           meshRef.current.rotation.y += delta * 0.2;
//         }
//       });

//       state.invalidate();
//     }, 1000 / targetFPS);
//     return () => {
//       clearInterval(interval);
//     };
//   }, [state, mainMeshRef, wireframeMeshRef]);
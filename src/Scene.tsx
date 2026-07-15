import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function Sparkles() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => Float32Array.from({length: 1800}, () => (Math.random() - .5) * 18), []);
  useFrame(({clock, pointer}) => { ref.current.rotation.y = clock.getElapsedTime() * .025; ref.current.rotation.x = pointer.y * .08; });
  return <Points ref={ref} positions={positions} stride={3} frustumCulled><PointMaterial transparent color="#f6a9d6" size={.035} sizeAttenuation depthWrite={false} opacity={.78}/></Points>;
}
function Hearts() {
  const ref = useRef<THREE.Group>(null!);
  const hearts = useMemo(() => Array.from({length: 18}, (_, i) => [Math.sin(i*3.4)*6, (i%6-3)*1.1, Math.cos(i*1.7)*4] as const), []);
  useFrame(({clock}) => {
    ref.current.rotation.y = clock.getElapsedTime() * .06;
    ref.current.children.forEach((c,i) => c.position.y += Math.sin(clock.getElapsedTime()+i)*.0015);
  });
  return (
    <group ref={ref}>
      {hearts.map((p,i) => (
        <mesh key={i} position={p} rotation={[0,0,Math.PI/4]}>
          <sphereGeometry args={[.11,12,12]} />
          <meshBasicMaterial color={i%2 ? '#b965ff' : '#ff9ecb'}  transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}
export default function Scene() {
  return (
    <div className="scene">
      <Canvas camera={{position:[0,0,0], fov:52}} dpr={[1,1.5]}>
        <color attach="background" args={['#080510']} />
        <fog attach="fog" args={['#080510',6,18]} />
        <Sparkles />
        <Hearts />
        <ambientLight intensity={1} />
        <OrbitControls enablePan={false} enableDamping dampingFactor={.08} minDistance={4} maxDistance={12} />
      </Canvas>
    </div>
  );
}
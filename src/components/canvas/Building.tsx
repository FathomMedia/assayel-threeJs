import { useGLTF } from '@react-three/drei'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import React, { useRef, useState } from 'react'
import { Object3D, Vector3, Mesh } from 'three'

interface IBuilding {
  url: string
  onBuildingClick: (obj: Object3D) => void
}

export default function Building({ url, onBuildingClick }: IBuilding) {
  const obj = useGLTF(url)

  const [hover, setHover] = useState(false)
  const meshRef = useRef<Mesh>(null!)

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.z += delta
  })

  function handleClick(event: ThreeEvent<MouseEvent>) {
    onBuildingClick(obj.scene.children[0])
    event.stopPropagation()
  }

  return (
    <group
      onClick={(event) => handleClick(event)}
      onPointerOver={(event) => (event.stopPropagation(), setHover(true))}
      onPointerOut={(event) => (event.stopPropagation(), setHover(false))}
    >
      <mesh>
        <primitive object={obj.scene} />
      </mesh>
      {
        <mesh
          ref={meshRef}
          position={[
            obj.scene.children[0].position.x,
            obj.scene.children[0].position.y + 20,
            obj.scene.children[0].position.z - 4,
          ]}
        >
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial color={hover ? 'hotpink' : 'orange'} />
        </mesh>
      }
    </group>
  )
}

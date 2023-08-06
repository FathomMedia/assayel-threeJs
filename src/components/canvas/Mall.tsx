'use client'

import React, { Suspense, useEffect, useRef, useState } from 'react'

import dynamic from 'next/dynamic'
import { useGLTF, PerspectiveCamera, CameraControls, Grid, Environment } from '@react-three/drei'
import { useLoader, useThree } from '@react-three/fiber'
import { Vector3, Quaternion } from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export const Mall = () => {
  const [camPos, setCamPos] = useState<[number, number, number]>([0, 100, 100])
  const cameraControlRef = useRef<CameraControls | null>(null)

  const b11 = useLoader(GLTFLoader, '/B11.glb')
  const b12 = useGLTF('/B12.glb')
  const b13 = useGLTF('/B13.glb')

  function handleBuildingClick(building: GLTF) {
    const target = building.scene.children[0]

    const rotation = cameraControlRef.current?.camera.rotation
    cameraControlRef.current?.setLookAt(
      target.position.x + 50,
      target.position.y + 50,
      target.position.z + 50,
      target.position.x,
      target.position.y,
      target.position.z,
      true,
    )
    rotation && cameraControlRef.current?.camera.setRotationFromEuler(rotation)
  }

  useEffect(() => {
    cameraControlRef.current?.setPosition(0, 100, 100)

    return () => {}
  }, [])

  function Ground() {
    const gridConfig = {
      cellSize: 0.5,
      cellThickness: 0.5,
      cellColor: '#6f6f6f',
      sectionSize: 3,
      sectionThickness: 1,
      sectionColor: '#30C9F4',
      fadeDistance: 200,
      fadeStrength: 1,
      followCamera: false,
      infiniteGrid: true,
    }
    return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
  }

  return (
    <Suspense fallback={null}>
      <mesh onClick={(event) => (event.stopPropagation(), handleBuildingClick(b11))}>
        <primitive object={b11.scene} />
      </mesh>
      <mesh onClick={(event) => (event.stopPropagation(), handleBuildingClick(b12))}>
        <primitive object={b12.scene} />
      </mesh>
      <mesh onClick={(event) => (event.stopPropagation(), handleBuildingClick(b13))}>
        <primitive object={b13.scene} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color={'hotpink'} />
      </mesh>
      <Common color={'lightblue'} />
      <PerspectiveCamera fov={40} makeDefault position={(camPos[0], camPos[1], camPos[2])} />
      <CameraControls makeDefault ref={cameraControlRef} />
      <Ground />
      <Environment preset='city' />
    </Suspense>
  )
}

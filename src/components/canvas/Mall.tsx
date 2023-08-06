'use client'

import React, { Suspense, useEffect, useRef, useState } from 'react'

import dynamic from 'next/dynamic'
import { PerspectiveCamera, CameraControls, Grid, Environment, OrthographicCamera } from '@react-three/drei'
import { Object3D } from 'three'
import Building from './Building'

const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export const Mall = () => {
  const [camPos, setCamPos] = useState<[number, number, number]>([0, 100, 100])
  const cameraControlRef = useRef<CameraControls | null>(null)

  function handleBuildingClick(building: Object3D) {
    const target = building

    const rotation = cameraControlRef.current?.camera.rotation
    cameraControlRef.current?.setLookAt(
      target.position.x + 100,
      target.position.y + 100,
      target.position.z + -100,
      target.position.x,
      target.position.y,
      target.position.z,
      true,
    )
    rotation && cameraControlRef.current?.camera.setRotationFromEuler(rotation)
  }

  function resetCamera() {
    const rotation = cameraControlRef.current?.camera.rotation
    cameraControlRef.current?.setLookAt(camPos[0], camPos[1], camPos[2], 0, 0, 0, true)
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
    <group>
      <Suspense fallback={<Building url={'/low/B11.glb'} onBuildingClick={handleBuildingClick} />}>
        <Building url={'/high/B11.glb'} onBuildingClick={handleBuildingClick} />
      </Suspense>

      <Suspense fallback={<Building url={'/low/B12.glb'} onBuildingClick={handleBuildingClick} />}>
        <Building url={'/high/B12.glb'} onBuildingClick={handleBuildingClick} />
      </Suspense>

      <Suspense fallback={<Building url={'/low/B13.glb'} onBuildingClick={handleBuildingClick} />}>
        <Building url={'/high/B13.glb'} onBuildingClick={handleBuildingClick} />
      </Suspense>

      <mesh onClick={resetCamera} position={[0, 0, 0]}>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color={'hotpink'} />
      </mesh>
      <Common color={'lightblue'} />

      <PerspectiveCamera fov={40} makeDefault position={(camPos[0], camPos[1], camPos[2])} />
      <CameraControls
        makeDefault
        ref={cameraControlRef}
        maxDistance={300}
        minDistance={200}
        enabled
        maxPolarAngle={Math.PI / 2.5}
      />
      <Ground />
      <Environment preset='city' />
    </group>
  )
}

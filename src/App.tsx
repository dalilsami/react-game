import React, { useEffect, useState, useRef } from "react"
import * as THREE from "three"

import Player from "./Classes/Player"

const App : React.FC = () => {
  const el: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
  const scene: THREE.Scene = new THREE.Scene()
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
  const player: Player = new Player()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  let cube: THREE.Mesh
  let requestID: number

  player.add(camera)
  scene.add(player)
  renderer.setSize(window.innerWidth, window.innerHeight)

  const createScene = () => el.current && el.current.appendChild(renderer.domElement)

  const addObjects = () => {
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const material = new THREE.MeshBasicMaterial({
      color: 0x442159,
      side: THREE.DoubleSide,
      flatShading: true
    })
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    const lights = []
    lights[0] = new THREE.PointLight(0xffffff, 1, 0)
    lights[1] = new THREE.PointLight(0xffffff, 1, 0)
    lights[2] = new THREE.PointLight(0xffffff, 1, 0)

    lights[0].position.set(0, 300, 0)
    lights[1].position.set(100, 200, 100)
    lights[2].position.set(-100, -200, -100)

    scene.add(lights[0])
    scene.add(lights[1])
    scene.add(lights[2])
  }

  const animate = () => {
    requestID = window.requestAnimationFrame(animate)
    player.update()
    renderer.render(scene, camera)
  }

  useEffect(() => {
    createScene()
    addObjects()
    animate()
  }, [])

  return <div ref={el}></div>
}

export default App

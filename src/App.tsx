import React, { useEffect, useState, useRef } from "react"
import * as THREE from "three"
import { tsMethodSignature } from "@babel/types"
import { string } from "prop-types"

enum Direction {
  Forward = "forward",
  Back = "back",
  Left = "left",
  Right = "right"
}

class Player {
  static inputMap: object = {
    "KeyW": Direction.Forward,
    "KeyS": Direction.Back,
    "KeyA": Direction.Left,
    "KeyD": Direction.Right
  }

  constructor(speed: number = 5) {
    this.speed = speed
    this.camera.position.z = 5
    this.bindInputs()
  }

  private speed: number

  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  private bindInputs = () : void => {
    window.addEventListener("keydown", e => {
      const direction: string = Player.inputMap[e.code]

      console.log(e, direction, direction in Direction)
      if (direction in Direction) {
        this.move(direction as Direction)
      }
    })
  }

  private move = (direction: Direction) : void => {
    if (direction === Direction.Left || direction === Direction.Right) {
      console.log(this.speed)
      this.camera.position.x += (direction === Direction.Left ? 1 : -1) * this.speed
    } else {
      this.camera.position.z += (direction === Direction.Forward ? 1 : -1) * this.speed
    }
  }
}

const App : React.FC = () => {
  const el: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
  const scene: THREE.Scene = new THREE.Scene()
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
  let player: Player
  let cube: THREE.Mesh
  let requestID: number

  renderer.setSize(window.innerWidth, window.innerHeight)
  const createScene = () => {
    if (el.current) {
      el.current.appendChild(renderer.domElement)
      player = new Player()
    }
  }

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
    renderer.render(scene, player.camera)
  }

  useEffect(() => {
    createScene()
    addObjects()
    animate()
  }, [])

  return <div ref={el}></div>
}

export default App

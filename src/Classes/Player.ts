import * as THREE from "three"

import * as Input from "./Input"

export enum Direction {
  Forward,
  Back,
  Left,
  Right
}

enum Axis {
  X,
  Y,
  Z
}

type Bindings = Direction
type BindingMap = { [key in Input.KeyCode]: Bindings }

class Player extends THREE.Object3D {
  public constructor(
    speed = Player.DefaultSpeed,
    sensitivity = Player.DefaultSensitivity,
    inputs = Player.Inputs
  ) {
    super()
    this.speed = speed
    this.sensitivity = sensitivity
    this.inputs = inputs
  }
  
  public update = () => {
    const movementX = Input.GetMouse(Input.MouseAxis.X) as number
    const movementY = Input.GetMouse(Input.MouseAxis.Y) as number

    if (movementX) {
      this.quaternion.y -= movementX * this.sensitivity
    }
    if (movementY) {
      this.quaternion.x -= movementY * this.sensitivity
    }
    for (let key in Player.Inputs) {
      if (Input.GetKey(Input.State.KeyDown, key as Input.KeyCode)) {
        this.inputActions[Player.Inputs[key as Input.KeyCode]]()
      }
    }
  }
  
  private static readonly Inputs: BindingMap = {
    [Input.KeyCode.W]: Direction.Forward,
    [Input.KeyCode.S]: Direction.Back,
    [Input.KeyCode.A]: Direction.Left,
    [Input.KeyCode.D]: Direction.Right
  }
  private static DefaultSpeed: number = 0.2
  private static DefaultSensitivity: number = 0.004

  private speed: number
  private sensitivity: number
  private inputs: BindingMap

  private move = (axis: Axis, value: number = 1) => () => {
    if (axis === Axis.X) {
      this.translateX(this.speed * value)
    }
    if (axis === Axis.Y) {
      this.translateY(this.speed * value)
    }
    if (axis === Axis.Z) {
      this.translateZ(this.speed * value)
    }
  }
  
  private inputActions: { [key in Bindings]: Function } = {
    [Direction.Forward]: this.move(Axis.Z, -1),
    [Direction.Back]: this.move(Axis.Z),
    [Direction.Left]: this.move(Axis.X, -1),
    [Direction.Right]: this.move(Axis.X)
  }
}

export default Player

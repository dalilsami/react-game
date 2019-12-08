export enum KeyCode {
  W = "KeyW",
  A = "KeyA",
  S = "KeyS",
  D = "KeyD"
}

export enum MouseAxis {
  X = "MouseX",
  Y = "MouseY",
  Both = "MouseBoth"
}

export enum State {
  Idle = "idle",
  KeyDown = "keydown",
  KeyUp = "keyup"
}

export type EventCode = KeyCode | MouseAxis

type InputMap<T> = { [key in EventCode]?: T }

const Values: InputMap<State | number | number[]> = {
  [MouseAxis.X]: 0,
  [MouseAxis.Y]: 0,
  [MouseAxis.Both]: [0, 0],
}

const Timeouts: InputMap<number | undefined> = {}

const BindEventListener = (v: State) => (e: KeyboardEvent) => {
  if (Timeouts[e.code as EventCode]) {
    clearTimeout(Timeouts[e.code as EventCode])
    Timeouts[e.code as EventCode] = 0
  }
  Values[e.code as EventCode] = v
  Timeouts[e.code as EventCode] = window.setTimeout(() => {
    Values[e.code as EventCode] = State.Idle
  }, 1000)
}

const BindMouseListener = (e: MouseEvent) => {
  if (Timeouts[MouseAxis.Both]) {
    clearTimeout(Timeouts[MouseAxis.Both])
    Timeouts[MouseAxis.Both] = 0
  }
  Values[MouseAxis.X] = e.movementX
  Values[MouseAxis.Y] = e.movementY
  Values[MouseAxis.Both] = [e.movementX, e.movementY]
  Timeouts[MouseAxis.Both] = window.setTimeout(() => {
    Values[MouseAxis.X] = 0
    Values[MouseAxis.Y] = 0
  }, 16)
}

Object
  .values(State)
  .forEach(v => window.addEventListener(
    v,
    BindEventListener(v) as EventListener
  ))
window.addEventListener("mousemove", BindMouseListener)

const RetrieveInputStateFromCode = (code: EventCode) =>
  Values[code] || State.Idle

export const GetKey = (state: State, code: EventCode) =>
  RetrieveInputStateFromCode(code) === state

export const GetMouse = (axis: MouseAxis): number | number[] =>
  (Values[axis] || 0) as number | number[]

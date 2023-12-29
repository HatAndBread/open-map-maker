const cursor = (s: string, offset?: {x: number, y: number}) => {
  return ({ cursor: `url('/${s}.png')${offset ? ` ${offset.x} ${offset.y}` : ""}, auto` })
}

const tools = {
  edit: {
    icon: "edit",
    tip: "Edit This Route",
    cursor: { cursor: "grab" },
    running: true
  },
  run: {
    icon: "play_circle",
    tip: "Follow This Route",
    cursor: { cursor: "grab" },
    running: false
  },
  route: {
    icon: "route",
    tip: "Add To Route",
    cursor: cursor("crosshair", { x: 16, y: 16 }),
    running: false

  },
  controlPoint: {
    icon: "radio_button_checked",
    tip: "Add Or Remove Control Points",
    cursor: cursor("controlpoint"),
    running: false
  },
  straightLine: {
    icon: "polyline",
    tip: "Draw Straight Lines",
    cursor: cursor("straightline", { x: 8, y: 16 }),
    running: false
  },
  streetView: {
    icon: "streetview",
    tip: "View Location in Google Street View",
    cursor: cursor("streetView"),
    running: false
  },
  undo: {
    icon: "undo",
    tip: "Undo",
    cursor: { cursor: "grab" },
    running: false
  },
  redo: {
    icon: "redo",
    tip: "Redo",
    cursor: { cursor: "grab" },
    running: false
  },
  myLocation: {
    icon: "my_location",
    tip: "My Location",
    cursor: { cursor: "grab" },
    running: false
  },
  layers: {
    icon: "layers",
    tip: "Set The Map Style",
    cursor: { cursor: "grab" },
    running: false
  },
  open: {
    icon: "file_open",
    tip: "Open A File",
    cursor: { cursor: "grab" },
    running: false
  },
  save: {
    icon: "save",
    tip: "Save File",
    cursor: { cursor: "grab" },
    running: false
  },
  delete: {
    icon: "delete",
    tip: "Delete This Route",
    cursor: { cursor: "grab" },
    running: false
  },
};

export type Tools = typeof tools

export {tools}

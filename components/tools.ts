const cursor = (s: string, offset?: {x: number, y: number}) => {
  return ({ cursor: `url('/${s}.png')${offset ? ` ${offset.x} ${offset.y}` : ""}, auto` })
}

const tools = {
  edit: {
    icon: "edit",
    tip: "Edit This Route",
    cursor: { cursor: "grab" },
    running: true,
    explanation: ""
  },
  run: {
    icon: "play_circle",
    tip: "Turn On Navigation Mode",
    cursor: { cursor: "grab" },
    running: false,
    explanation: "Turn on navigation mode to follow your route on your phone."
  },
  route: {
    icon: "route",
    tip: "Add To Route",
    cursor: cursor("crosshair", { x: 16, y: 16 }),
    running: false,
    explanation: `Click anywhere on the map to add add a "Control Point" to your map. `

  },
  controlPoint: {
    icon: "radio_button_checked",
    tip: "Add Or Remove Control Points",
    cursor: cursor("controlpoint"),
    running: false,
    explanation: `Click anywhere on the map to add add a "Control Point" to your map. `

  },
  straightLine: {
    icon: "polyline",
    tip: "Draw Straight Lines",
    cursor: cursor("straightline", { x: 8, y: 16 }),
    running: false,
    explanation: `Click anywhere on the map to add add a "Control Point" to your map.`
  },
  streetView: {
    icon: "streetview",
    tip: "View Location in Google Street View",
    cursor: cursor("streetView"),
    running: false,
    explanation: `Click anywhere on the map to view the location in Google Street View.`
  },
  undo: {
    icon: "undo",
    tip: "Undo",
    cursor: { cursor: "grab" },
    running: false,
    explanation: `Undo your last change.`
  },
  redo: {
    icon: "redo",
    tip: "Redo",
    cursor: { cursor: "grab" },
    running: false,
    explanation: `Redo your last change.`
  },
  myLocation: {
    icon: "my_location",
    tip: "My Location",
    cursor: { cursor: "grab" },
    running: false,
    explanation: `Center on your current location.`
  },
  layers: {
    icon: "layers",
    tip: "Set The Map Style",
    cursor: { cursor: "grab" },
    running: false,
    explanation: `Change the map layer between CyclOSM, Open Street Maps, and Mapbox satellite views.`
  },
  open: {
    icon: "file_open",
    tip: "Open A File",
    cursor: { cursor: "grab" },
    running: false,
    explanation: `Open a GPX file to edit.`
  },
  save: {
    icon: "download",
    tip: "Save File",
    cursor: { cursor: "grab" },
    running: false,
    explanation: `Save your route as a GPX file to be uploaded to another device or to be edited again in Open Map Maker.`
  },
  delete: {
    icon: "delete",
    tip: "Delete This Route",
    cursor: { cursor: "grab" },
    running: false,
    explanation: `Clear the current map.`
  },
};

export type Tools = typeof tools

export {tools}

const cursor = (s: string, offset?: {x: number, y: number}) => {
  return ({ cursor: `url('/${s}.png')${offset ? ` ${offset.x} ${offset.y}` : ""}, auto` })
}

const tools = {
  route: {
    icon: "route",
    tip: "Add To Route",
    cursor: cursor("crosshair", { x: 16, y: 16 }),
  },
  controlPoint: {
    icon: "radio_button_checked",
    tip: "Add Or Remove Control Points",
    cursor: cursor("controlpoint"),
  },
  straightLine: {
    icon: "polyline",
    tip: "Draw Straight Lines",
    cursor: cursor("straightline", { x: 8, y: 16 }),
  },
  streetView: {
    icon: "streetview",
    tip: "View Location in Google Street View",
    cursor: cursor("streetView"),
  },
  weather: {
    icon: "cloud",
    tip: "Get Weather Forecast for Location",
    cursor: cursor("weather"),
  },
  undo: {
    icon: "undo",
    tip: "Undo",
    cursor: { cursor: "grab" },
  },
  redo: {
    icon: "redo",
    tip: "Redo",
    cursor: { cursor: "grab" },
  },
  open: {
    icon: "file_open",
    tip: "Open A File",
    cursor: { cursor: "grab" },
  },
  save: {
    icon: "save",
    tip: "Save File",
    cursor: { cursor: "grab" },
  },
};

export type Tools = typeof tools

export {tools}

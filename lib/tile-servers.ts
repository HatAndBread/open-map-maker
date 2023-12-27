export default {
    osm: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    get cyclosm() {
      const server = ["a", "b", "c"][Math.floor(Math.random() * 3)]
      return `https://${server}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png`
    },
  }



const url = (lat: number | string, lng: number | string) => `http://google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0`;

export default {
  get isProbablyDesktop() {
    return screen.width > 1000 && screen.width > 500
  },
  goto({latlng}: L.LeafletMouseEvent) {
    const url = `http://google.com/maps?q=&layer=c&cbll=${latlng.lat},${latlng.lng}&cbp=12,0,0,0,0`
    if (this.isProbablyDesktop) {
      const win = window.open(
        url,
        "Google Map View",
        `height=${(window.screen.height / 2).toFixed(0)},width=${(
          window.screen.width / 2
        ).toFixed(0)}`
      );
      if (!win || win.closed || typeof win.closed === 'undefined') {
        alert('Please enable pop ups for this site to use Google Street View.');
      }
    } else {
      window.open(url, "_blank");
    }
  }
}

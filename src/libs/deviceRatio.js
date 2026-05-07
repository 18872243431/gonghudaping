export default function deviceRatio() {
  var ratio = 0,
    screen = window.screen,
    ua = navigator.userAgent.toLowerCase()
  let view = document.querySelector('body')
  if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio
  } else if (~ua.indexOf('msie')) {
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI
    }
  } else if (
    window.outerWidth !== undefined &&
    window.innerWidth !== undefined
  ) {
    ratio = window.outerWidth / window.innerWidth
  }
  if (ratio && ratio !== 1) {
    if (ratio >= 2) {
      ratio = ratio / 2
    } else if (ratio >= 3) {
      ratio = ratio / 3
    }
    view.style.zoom = -0.62 * ratio + 1.65
  }
  console.log('dpi', ratio)
}

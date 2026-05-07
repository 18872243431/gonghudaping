// 使dom绑定事件 兼容主流浏览器
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

// 使dom删除事件 兼容主流浏览器
/* istanbul ignore next */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

export function prevent(e) {
  const oEvent = e || window.event
  if (oEvent.preventDefault) {
    oEvent.preventDefault()
  }
  return oEvent
}

// 使鼠标滚轮事件 兼容主流浏览器
export function wheelEvent(el, callback) {
  if (window.navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
    on(el, 'DOMMouseScroll', wheel)
  } else {
    on(el, 'mousewheel', wheel)
  }

  function wheel(ev) {
    const oEvent = prevent(ev)
    const delta = oEvent.detail ? oEvent.detail > 0 : oEvent.wheelDelta < 0
    callback && callback.call(this, delta, oEvent)
    return false
  }
}

/**
 * 使requestAnimationFrame 兼容主流浏览器
 */
export const requestAnimationFrame = (function () {
  if (!window.requestAnimationFrame) {
    return (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  }
  return window.requestAnimationFrame
})()

// 返回顶部
export function scrollTop(el, from = 0, to, duration = 500) {
  const difference = Math.abs(from - to)
  const step = Math.ceil((difference / duration) * 50)
  scroll(el, from, to, step)
}
/**
 * [scroll 滚动条从start滚动到end]
 * @param  {[type]} el    [要滚动元素]
 * @param  {[type]} start [开始位置]
 * @param  {[type]} end   [结束位置]
 * @param  {[type]} step  [滚动的步长]
 * @return {[type]}       [description]
 */
export function scroll(el, start, end, step = 50) {
  if (start === end) return

  // 从上往下滚
  let d = start + step > end ? end : start + step
  // 从下往上滚
  if (start > end) {
    d = start - step < end ? end : start - step
  }

  if (el === window) {
    window.scrollTo(d, d)
  } else {
    el.scrollTop = d
  }
  requestAnimationFrame(() => scroll(el, d, end, step))
}

// 绑定dom事件，只执行一次
export const once = function (el, event, fn) {
  var listener = function () {
    if (fn) {
      fn.apply(this, arguments)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
}
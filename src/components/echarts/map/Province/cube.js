import * as echarts from 'echarts'
export const CubeLeft = echarts.graphic.extendShape({
  buildPath: function(ctx, shape) {
    const width = shape.cubeOption.width / 2
    const height = shape.cubeOption.height / 2
    const value = shape.value
    const c0 = [shape.x, shape.y]
    const c1 = [shape.x - width, shape.y - height]
    const c2 = [shape.x - width, shape.y - height - value]
    const c3 = [shape.x, shape.y - value]
    ctx
      .moveTo(c0[0], c0[1])
      .lineTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .closePath()
  },
})

export const CubeRight = echarts.graphic.extendShape({
  buildPath: function(ctx, shape) {
    const width = shape.cubeOption.width / 2
    const height = shape.cubeOption.height / 2
    const value = shape.value
    const c0 = [shape.x, shape.y]
    const c1 = [shape.x + width, shape.y - height]
    const c2 = [shape.x + width, shape.y - height - value]
    const c3 = [shape.x, shape.y - value]
    ctx
      .moveTo(c0[0], c0[1])
      .lineTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .closePath()
  },
})

export const CubeTop = echarts.graphic.extendShape({
  buildPath: function(ctx, shape) {
    const width = shape.cubeOption.width / 2
    const height = shape.cubeOption.height / 2
    const value = shape.value
    const c0 = [shape.x, shape.y - value]
    const c1 = [shape.x + width, shape.y - height - value]
    const c2 = [shape.x, shape.y - height * 2 - value]
    const c3 = [shape.x - width, shape.y - height - value]
    ctx
      .moveTo(c0[0], c0[1])
      .lineTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .closePath()
  },
})

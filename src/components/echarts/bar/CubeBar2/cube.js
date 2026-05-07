import * as echarts from 'echarts'

export const CubeLeft = echarts.graphic.extendShape({
  buildPath: function(ctx, shape) {
    const xAxisPoint = shape.xAxisPoint
    const index = shape.index
    const width = shape.cubeOption.width / 2
    const height = shape.cubeOption.height / 2
    const space = shape.cubeOption.space
    const c0 = [xAxisPoint[0], xAxisPoint[1]]
    const c1 = [xAxisPoint[0] - width, xAxisPoint[1] - height]
    const c2 = [shape.x - width, shape.y - height]
    const c3 = [shape.x, shape.y]
    const offset = (width + space) * index
    ctx
      .moveTo(c0[0] + offset, c0[1])
      .lineTo(c1[0] + offset, c1[1])
      .lineTo(c2[0] + offset, c2[1])
      .lineTo(c3[0] + offset, c3[1])
      .closePath()
  },
})

export const CubeRight = echarts.graphic.extendShape({
  buildPath: function(ctx, shape) {
    const xAxisPoint = shape.xAxisPoint
    const index = shape.index
    const width = shape.cubeOption.width / 2
    const height = shape.cubeOption.height / 2
    const space = shape.cubeOption.space
    const c0 = [xAxisPoint[0], xAxisPoint[1]]
    const c1 = [xAxisPoint[0] + width, xAxisPoint[1] - height]
    const c2 = [shape.x + width, shape.y - height]
    const c3 = [shape.x, shape.y]
    const offset = (width + space) * index
    ctx
      .moveTo(c0[0] + offset, c0[1])
      .lineTo(c1[0] + offset, c1[1])
      .lineTo(c2[0] + offset, c2[1])
      .lineTo(c3[0] + offset, c3[1])
      .closePath()
  },
})

export const CubeTop = echarts.graphic.extendShape({
  buildPath: function(ctx, shape) {
    const index = shape.index
    const width = shape.cubeOption.width / 2
    const height = shape.cubeOption.height / 2
    const space = shape.cubeOption.space
    const c0 = [shape.x, shape.y]
    const c1 = [shape.x + width, shape.y - height]
    const c2 = [shape.x, shape.y - height * 2]
    const c3 = [shape.x - width, shape.y - height]
    const offset = (width + space) * index
    ctx
      .moveTo(c0[0] + offset, c0[1])
      .lineTo(c1[0] + offset, c1[1])
      .lineTo(c2[0] + offset, c2[1])
      .lineTo(c3[0] + offset, c3[1])
      .closePath()
  },
})

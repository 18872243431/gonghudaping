import * as echarts from 'echarts'

export const HCubeTop = echarts.graphic.extendShape({
  buildPath: function(ctx, shape) {
    const index = shape.index
    const width = shape.cubeOption.width / 2
    const height = shape.cubeOption.height / 2
    const space = shape.cubeOption.space
    const offset = (width + space) * index
    const yAxisPoint = shape.yAxisPoint
    const c0 = [shape.x, shape.y]
    const c1 = [shape.x + height, shape.y - width]
    const c2 = [yAxisPoint[0] + height, yAxisPoint[1] - width]
    const c3 = [yAxisPoint[0], yAxisPoint[1]]
    ctx
      .moveTo(c0[0], c0[1] + offset)
      .lineTo(c1[0], c1[1] + offset)
      .lineTo(c2[0], c2[1] + offset)
      .lineTo(c3[0], c3[1] + offset)
      .closePath()
  },
})

export const HCubeBottom = echarts.graphic.extendShape({
  buildPath: function(ctx, shape) {
    const index = shape.index
    const width = shape.cubeOption.width / 2
    const height = shape.cubeOption.height / 2
    const space = shape.cubeOption.space
    const offset = (width + space) * index
    const yAxisPoint = shape.yAxisPoint
    const c0 = [shape.x, shape.y]
    const c1 = [shape.x + height, shape.y + width]
    const c2 = [yAxisPoint[0] + height, yAxisPoint[1] + width]
    const c3 = [yAxisPoint[0], yAxisPoint[1]]
    ctx
      .moveTo(c0[0], c0[1] + offset)
      .lineTo(c1[0], c1[1] + offset)
      .lineTo(c2[0], c2[1] + offset)
      .lineTo(c3[0], c3[1] + offset)
      .closePath()
  },
})

export const HCubeRight = echarts.graphic.extendShape({
  buildPath: function(ctx, shape) {
    const index = shape.index
    const width = shape.cubeOption.width / 2
    const height = shape.cubeOption.height / 2
    const space = shape.cubeOption.space
    const c0 = [shape.x + height, shape.y + width]
    const c1 = [shape.x, shape.y]
    const c2 = [shape.x + height, shape.y - width]
    const c3 = [shape.x + 2 * height, shape.y]
    const offset = (width + space) * index
    ctx
      .moveTo(c0[0], c0[1] + offset)
      .lineTo(c1[0], c1[1] + offset)
      .lineTo(c2[0], c2[1] + offset)
      .lineTo(c3[0], c3[1] + offset)
      .closePath()
  },
})

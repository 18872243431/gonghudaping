/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2022-10-27 11:15:20
 * @LastEditTime: 2022-10-27 15:49:46
 */
// const project = process.env.PROJECT
const path = require('path')
const fs = require('fs')
const mockPath = path.join(__dirname, `./mockdata/index.js`)
const mockdata = require(mockPath)
const existurl = mockdata.map(item => item[0])
const mockSmallUrl = require(path.join(__dirname, `./mockSmallData.js`))

const bodyParser = require('body-parser')
const proxy = require('http-proxy-middleware')
const baseurl = require('./config').baseurl

module.exports = (app, proxyTable) => {
  // console.log(process.env, '============process.env=============================')
  if (process.env.VUE_APP_MOCK) return
  // 设置代理
  for (let key in proxyTable) {
    app.use(proxy((pathname) => {
      // 过滤后台已存在的url
      return pathname.match(key) && existurl.findIndex(item => pathname.endsWith(item)) === -1
    }, proxyTable[key]))
  }

  // bodyParser中间键必须放在proxy后面，否则代理请求会被挂起 Provisional headers are shown
  // app.use(bodyParser.json())
  // app.use(bodyParser.urlencoded({ extended: true })) // Content-Type: application/x-www-form-urlencoded
  //handle request entity too large
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  // 保存数据到本地
  app.post('/mock/saveMockData', (req, res) => {
    console.log(req.body, '========mockdata=================')

    let { url, data } = req.body
    // console.log(url, '====url====')
    url = url.replace(baseurl, '')

    const index = mockdata.findIndex(item => item[0] === url)

    const mockSmallIndex = mockSmallUrl.findIndex(item => item === url)

    let desData = []

    if (mockSmallIndex !== -1) {
      const arr = data.data.slice(0, 10)
      desData = [url,
        {
          "errorType": data.msg,
          "isNormal": data.code,
          "returnModel": arr
        }
      ]
      console.log(desData, '====desData====')
    } else {
      desData = [url, data]
    }

    if (index === -1) {
      mockdata.push(desData)
    } else {
      mockdata[index][1] = desData[1]
    }
    const d = `module.exports = ${JSON.stringify(mockdata, null, 2)}`
    fs.writeFileSync(mockPath, d, 'utf8')
    res.send('success')
  })
}

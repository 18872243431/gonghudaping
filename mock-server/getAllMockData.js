/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2022-10-27 11:22:56
 * @LastEditTime: 2022-10-27 15:50:01
 */
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const mockPath = path.join(__dirname, `./mockdata/index.js`)
const GetUrls = require('./mockdata/GetUrls')
const existData = require(mockPath)
const existurls = existData.map(item => item[0])
const apis = []
const proxy = 'http://39.98.200.240:9090/mock/595'
getAllUrls(path.join(__dirname, `../src/api`))
const urls = apis.filter(item => !existurls.includes(item))

console.log(proxy, '=========proxy=========')
console.log(existurls, 'existurls')
console.log(apis, 'apis')
console.log(urls, 'urls')

if (urls.length) {
  runningEnd()
    .then(({ data, errorInterfaces, undefinedInterfaces }) => {
      undefinedInterfaces.length && console.error('未定义接口', undefinedInterfaces)
      errorInterfaces.length && console.error('请求失败的接口', errorInterfaces)
      const _data = `// 未定义接口\nexports.undefinedInterfaces = ${JSON.stringify(undefinedInterfaces)}\n\n` +
        `// 请求失败的接口\nexports.errorInterfaces = ${JSON.stringify(errorInterfaces)}\n\n` +
        `module.exports = ${JSON.stringify(data.concat(existData), null, 2)}`
      fs.writeFileSync(mockPath, _data, 'utf8')
    })
}

// 获取所有的url
function getAllUrls (path) {
  fs.readdirSync(path).forEach(file => {
    const newPath = [path, file].join('/')
    const stat = fs.statSync(newPath)
    if (stat.isFile()) {
      if (/(.*)\.(js)/.test(file)) {
        const data = fs.readFileSync(newPath)
        const reg = /url: [\'|\"]([a-zA-Z1-9\_\-\.\/]+)[\'|\"]/g
        // const url = data.toString().match(reg)
        let url
        while (url = reg.exec(data)) {
          apis.push(url[1])
        }
      }
    } else if (stat.isDirectory()) {
      getAllUrls(newPath)
    }
  })
}

function asyncTo (promise, errTxt) {
  return promise
    .then(data => [null, data])
    .catch(err => {
      console.warn('err:', err)
      err = errTxt || '请求失败'
      return [err, undefined]
    })
}

// 请求封装
function ajax (url) {
  console.error('ajax geturls:', GetUrls.includes(url))
  const mType = GetUrls.includes(url) ? 'get' : 'post'
  return axios({
    url: `${proxy}${url}`,
    method: mType,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
}

// 一直执行完所有的请求
async function runningEnd () {
  const arr = []
  const errorInterfaces = []
  const undefinedInterfaces = []
  for (let url of urls) {
    const [err, res] = await asyncTo(ajax(url))
    console.log('err, res:', err)
    if (err) {
      console.error(url, '请求失败')
      errorInterfaces.push(url)
    } else {
      const { data } = res
      if (data.errcode === 404) {
        console.error(url, '此接口未定义')
        undefinedInterfaces.push(url)
      } else {
        console.log(url, data, '===请求成功===')
        arr.push([url, data])
      }
    }
  }
  return {
    data: arr,
    errorInterfaces,
    undefinedInterfaces
  }
}

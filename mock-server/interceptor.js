/**
 * 打包后，如果后台的一些接口没有对应的数据，使用前端mock数据
 */
const Mock = require('mockjs')
const mockdata = require(`./mockdata/index`)
const existurl = require(`./screen/existurl`)
const baseurl = require('./config').baseurl

mockdata.forEach(item => {
  if (!existurl.includes(item[0])) {
    Mock.mock(`${baseurl}${item[0]}`, item[1])
  }
})

// 将Mock拦截暴露出来
export default Mock

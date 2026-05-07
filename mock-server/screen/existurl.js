/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2022-10-27 11:15:20
 * @LastEditTime: 2022-10-28 15:15:29
 */
// 如果服务端已存在对应的接口，不走mock数据，这里添加服务端已有的接口即可
// 如果main.js中引入intercetor.js，则是走的mock拦截，不需要重启node服务
// 如果main.js中没有引入intercetor.js，则是走的node服务，则此处有改动需要重启node服务
module.exports = [
  '/mock/testGet'
]
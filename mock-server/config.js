/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2022-10-27 11:15:20
 * @LastEditTime: 2022-10-28 15:11:02
 */
const isProd = process.env.NODE_ENV === 'production'

let baseurl = ''

if (isProd) {
  baseurl = process.env.VUE_APP_BASE_API
}



module.exports = {
  baseurl
}

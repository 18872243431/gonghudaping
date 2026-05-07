// 未定义接口
exports.undefinedInterfaces = ["/login","/logout","/getInfo","/getRouters"]

// 请求失败的接口
exports.errorInterfaces = []

module.exports = [
  [
    "/mock/testGet",
    {
      "success": true,
      "data": {
        "method": "get",
        "type": "static",
        "info": "OK"
      }
    }
  ],
  // [
  //   "/mock/testPost",
  //   {
  //     "success": true,
  //     "data": {
  //       "method": "post",
  //       "type": "static",
  //       "info": "OK"
  //     }
  //   }
  // ],
  [
    "/mock/noStatic",
    {
      "success": true,
      "data": {
        "method": "nostaticdata",
        "type": "static",
        "info": "OK"
      }
    }
  ]
]
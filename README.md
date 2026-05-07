<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-12-20 18:15:34
 * @LastEditTime: 2021-12-21 11:25:29
 * @Description:
-->

## package.json 的script 命令说明

### 从服务端将接口数据获取并保存在本地（一般从yapi上拉取数据）：

``` bash
npm run gen-mockdata
```

其程序文件路径是：

```bash
/mock-server/getAllMockData.js
```

服务端的路径在上述文件里：

```javascript
const proxy = 'http://39.98.200.240:9090/mock/595'
```

保存的路径：


```bash
/mock-server/mockdata/index.js
```

> 上面文件已经存在的数据，执行命令时候是不会再被拉取，如果想更新数据就得将原来的本地数据去掉。

### 开发模式

> 开发模式下一共分成三种情况，第一种是 `server` 模式，这个模式主要是用来和服务端联调，第二种是 `yapi` 模式，用来和 `yapi` 做接口联调，第三种是使用本地的静态数据 `static`。

下面是 **`server`** 模式：

``` bash
npm run dev:server
```

详细配置在 `.env.dev-server` 文件：

```
NODE_ENV = development
VUE_APP_CURRENTMODE = dev-server
VUE_APP_BASE_API = ''
VUE_APP_TARGET_URL = http://39.98.200.240:9090/mock/595
```

下面是 **`yapi`** 模式：

``` bash
npm run dev:yapi
```

详细配置在 `.env.dev-yapi` 文件：

```
NODE_ENV = development
VUE_APP_CURRENTMODE = dev-yapi
VUE_APP_BASE_API = ''
VUE_APP_TARGET_URL = http://39.98.200.240:9090/mock/591
```

下面是 **`static`** 模式：

``` bash
npm run dev:static
```

详细配置在 `.env.dev-static` 文件：

```
NODE_ENV = development
VUE_APP_CURRENTMODE = dev-static
VUE_APP_BASE_API = ''
VUE_APP_TARGET_URL = 'http://39.98.200.240:9090/mock/595'
VUE_APP_MOCK = true
```

使用的静态数据在文件 **`/mock-server/mockdata/index.js`** 文件里存储。如果请求的URL在静态文件里没有对应的数据，那么就会通过代理的服务端获取数据。

如果我们不想使用静态数据，强制使用代理的服务端，那么可以在：

``` bash
/mock-server/screen/existurl.js
```

文件里配置的url将不会获取静态数据，而是通过服务端获取数据。

### 生产模式

下面是 **`server`** 模式，这个模式用户打生产包，具体如下：

``` bash
npm run build:server
```

详细配置在 `.env.prod-server` 文件：

```
NODE_ENV = production
VUE_APP_CURRENTMODE = prod-server
VUE_APP_BASE_API = ''
VUE_APP_MOCK = false
outputDir = server-dist
```

如果我们以服务端的请求为主要请求，那么如果有的请求需要获取yapi的数据，可以在具体的程序里这么来写：

```javascript
export function noStatic() {
  return fetch({
    url: '/mock/noStatic',
    method: 'post',
    baseURL: 'http://39.98.200.240:9090/mock/595/'
  })   
}
```

下面是 **`yapi`** 模式，这个模式下打出来的包可以访问yapi上的mock数据：

``` bash
npm run build:yapi
```

详细配置在 `.env.prod-yapi` 文件：

```
NODE_ENV = production
VUE_APP_CURRENTMODE = prod-yapi
VUE_APP_BASE_API = http://39.98.200.240:9090/mock/591/
VUE_APP_MOCK = false
outputDir = yapi-dist
```

如果我们以yapi的请求为主要请求，那么如果有的请求需要获取服务端的数据，可以在具体的程序里这么来写：

```javascript
export function noStatic() {
  return fetch({
    url: '/mock/noStatic',
    method: 'post',
    baseURL: 'http://39.98.200.240:9090/mock/595/'
  })   
}
```

下面是 **`static`** 模式，这个模式下URL请求访问静态数据，如果URL没有对应的静态数据，那就会请求服务端：

详细配置在 `.env.prod-static` 文件：

```
NODE_ENV = production
VUE_APP_CURRENTMODE = prod-server-static
VUE_APP_BASE_API = ''
VUE_APP_MOCK = true
outputDir = static-dist
```

``` bash
/mock-server/screen/existurl.js
```

文件里配置的url将不会获取静态数据，而是通过服务端获取数据。

### 公共组件 demo

- [背景地图](http://localhost:9300/#/echarts/chinaMap)

- [折线图、柱状图、排名](http://localhost:9300/#/echarts)

- [时间轴](http://localhost:9300/#/componentsDemo/progressBar)

- [树图、电池排名、关系图](http://localhost:9300/#/demo/sample)

- [树图动画](http://localhost:9300/#/demo/tree)

- [统计类](http://localhost:9300/#/demo/total)

- [列表](http://localhost:9300/#/demo/table)

- [饼图](http://localhost:9300/#/demo/pie)

### 公共方法

- String 方法

  - 驼峰转线
  - 首字母大写
  - 获得字符串实际长度，中文 2，英文 1
  - 高亮关键字的颜色
  - 根据指定长度，以指定的分隔符分割 数据，主要用于分割数字 如果 123456 => 123,456
  - 格式化数字
  - 截取字符串，中英文都能用
  - 生成一个指定长度的 uuid
  - excel 列字母生成函数，n >= 1
  - excel 列字母生成函数
  - excel 列字母转数字函数
  - base64 编码 btoa
  - base64 解码 atob
  - 将对象转成 url 参数字符串，并 base64 编码与 encodeURIComponent
  - 将 decodeURIComponent 与 base64 编码的 url 参数字符串转成对象

- Date 方法

  - 日期类型判断
  - 根据日期获取 星期几
  - 格式化时间
  - js 时间转化为几天前,几小时前，几分钟前
  - 格式化一个时间戳的时间段
  - 获取从 num 开始的一个星期的时间
  - 获取从 time 时间开始前 num 天的时间

- Number 方法

  - 生成指定范围的随机数

- Array | Object 方法

  - 随机取一个元素
  - 复制数组
  - 合并相同索引的数组
  - 相同索引的数组相加
  - 随机排列
  - 管道函数，返回一个函数
  - 组合函数，返回一个函数
  - 函数柯里化
  - 深度克隆
  - getLabelByValue 将字典对应的 code 转换成 name
  - 将数组对象的 key 转换为 label 与 value 的 select 类型的 label 与 value 对象
  - async/await catch 错误
  - 异步请求
  - 睡眠函数
  - 处理报错
  - 防抖函数
  - 节流函数
  - 清空 el-form
  - 获取中间值

- 其他
  - window 打开页面
  - 上传图片文件转成 base64
  - 按照指定的长度分割数据
  - 映射视觉最大值

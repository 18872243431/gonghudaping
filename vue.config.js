/* eslint-disable */
// 配置ES6的module语法可以在node中使用
require("babel-register")({
  presets: [
    [
      "env",
      {
        targets: {
          node: "current",
        },
      },
    ],
  ],
});
const path = require("path");
const fs = require("fs");
const styleVarsPrefix = path.resolve(
  __dirname,
  `./src/assets/theme/style-vars`
);
const scssStyleVarsPath = [styleVarsPrefix, "scss"].join(".");
const jsStyleVarsPath = [styleVarsPrefix, "js"].join(".");
const IS_PROD = process.env.NODE_ENV === "production";
const fcfg = require("./src/config/").default;

// const getMockData = require('./mock-server/index').getMockData
// //项目启动获取所有mock接口返回的数据
// getMockData()

function resolve(dir) {
  return path.join(__dirname, dir);
}

function isFile(_path) {
  try {
    const stat = fs.statSync(_path);
    return stat.isFile();
  } catch (e) {
    // console.log(e)
    return false;
  }
}

function changeStyleFile(data) {
  let _data = data;
  if (data) {
    _data = Object.keys(data)
      .map((key) => `$${key}: ${data[key]};`)
      .join("\n");
  }
  const oldData = isFile(scssStyleVarsPath)
    ? fs.readFileSync(scssStyleVarsPath).toString()
    : null;

  oldData !== _data && fs.writeFileSync(scssStyleVarsPath, _data);
}

const chains = {
  setAlias(config) {
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("public", resolve("./public"))
      .set("@c", resolve("./src/components"))
      .set("mixins", resolve("./src/mixins"))
      .set("assets", resolve("./src/assets"))
      .set("views", resolve("./src/views"))
      .set("router", resolve("./src/router"))
      .set("api", resolve("./src/api"));
  },
  // 设置标题
  setTitle(config) {
    config.plugin("html").tap((args) => {
      args[0].title = fcfg.name;
      return args;
    });
  },
  // scss全局参数
  setScssGlobalVars(config) {
    const oneOfsMap = config.module.rule("scss").oneOfs.store;
    oneOfsMap.forEach((item) => {
      item
        .use("sass-resources-loader")
        .loader("sass-resources-loader")
        .options({
          resources: [
            resolve(
              "./node_modules/element-plus/theme-chalk/src/common/var.scss"
            ),
            scssStyleVarsPath,
            "./src/assets/css/mixins.scss",
            "./src/assets/css/px2vw.scss",
          ],
        })
        .end();
    });
  },
  // 监听全局js样式文件，并更新全局scss变量文件
  handleVars() {
    if (IS_PROD) return;
    let data = "";
    if (!isFile(jsStyleVarsPath)) {
      const str = `export default {
        // default: '#409EFF'
      }`;
      fs.writeFileSync(jsStyleVarsPath, str);
    } else {
      data = require(jsStyleVarsPath).default;
    }
    changeStyleFile(data);
    fs.watchFile(jsStyleVarsPath, async () => {
      delete require.cache[require.resolve(jsStyleVarsPath)];
      const d = require(jsStyleVarsPath).default;
      changeStyleFile(d);
    });
  },
};

// configureWebpack相关函数
const proConfigures = {
  uglify() {
    const TerserPlugin = require("terser-webpack-plugin");
    return IS_PROD
      ? [
          new TerserPlugin({
            terserOptions: {
              warnings: false,
              compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ["console.log"], // 移除console
              },
            },
            sourceMap: false,
            parallel: true,
          }),
        ]
      : [];
  },
};

module.exports = {
  assetsDir: "public",
  outputDir: IS_PROD
    ? process.env.VUE_APP_SCREEN_WIDTH == 3840
      ? "package2"
      : "package1"
    : "./dist",
  publicPath: "./",
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  // lintOnSave: !IS_PROD,
  lintOnSave: false,
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  transpileDependencies: ["vue-router"],
  css: {
    extract: {
      ignoreOrder: true,
    },
  },
  devServer: {
    port: 6398,
    useLocalIp: true,
    open: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    proxy: fcfg.proxy,
  },
  chainWebpack(config) {
    Object.keys(chains).forEach((key) => {
      chains[key](config);
    });
  },
  configureWebpack(config) {
    IS_PROD &&
      Object.keys(proConfigures).forEach((key) => {
        config.plugins.push(...proConfigures[key](config));
      });
    return {
      module: {
        rules: [
          {
            test: /\.mjs$/,
            include: /node_modules/,
            type: "javascript/auto",
          },
        ],
      },
      ...(IS_PROD
        ? {
            optimization: {
              splitChunks: {
                minChunks: 1,
                chunks: "all",
                maxInitialRequests: 5,
                minSize: 0,
                cacheGroups: {
                  "element-plus": {
                    test: /element-plus/,
                    name: "element-plus",
                    priority: 1,
                  },
                },
              },
            },
          }
        : {}),
    };
  },
};

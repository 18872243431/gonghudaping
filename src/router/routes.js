const is16 = process.env.VUE_APP_SCREEN_WIDTH === "1920";
const Layout = is16
  ? () => import(/* webpackChunkName: "Layout" */ "views/layout/index16.vue")
  : () => import(/* webpackChunkName: "Layout" */ "views/layout/index.vue");
const WrapperView = () =>
  import(/* webpackChunkName: "WrapperView" */ "views/WrapperView/index.vue");
const demo = () =>
  import(/* webpackChunkName: "demo" */ "views/demo/index.vue");
const controldevice = () =>
  import(
    /* webpackChunkName: "controldevice" */ "views/controldevice/index.vue"
  );

const abroadAttackerThreat = is16
  ? () =>
      import(
        /* webpackChunkName: "abroadAttackerThreat" */ "views/abroadAttackerThreat/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "abroadAttackerThreat" */ "views/abroadAttackerThreat/index.vue"
      );

const basicdata = is16
  ? () =>
      import(/* webpackChunkName: "basicdata" */ "views/basicdata/index16.vue")
  : () =>
      import(/* webpackChunkName: "basicdata" */ "views/basicdata/index.vue");
const securitypower = () =>
  import(
    /* webpackChunkName: "securitypower" */ "views/securitypower/index.vue"
  );

const specialMonitoring = is16
  ? () =>
      import(
        /* webpackChunkName: "specialMonitoring" */ "views/specialMonitoring/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "specialMonitoring" */ "views/specialMonitoring/index.vue"
      );

const Architecture = is16
  ? () =>
      import(
        /* webpackChunkName: "Architecture" */ "views/architecture/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "Architecture" */ "views/architecture/index.vue"
      );
const datasecurity = is16
  ? () =>
      import(
        /* webpackChunkName: "datasecurity" */ "views/datasecurity/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "datasecurity" */ "views/datasecurity/index.vue"
      );
const networksecurity = is16
  ? () =>
      import(
        /* webpackChunkName: "networksecurity" */ "views/networksecurity/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "networksecurity" */ "views/networksecurity/index.vue"
      );
const enterpriseSecurity = is16
  ? () =>
      import(
        /* webpackChunkName: "enterpriseSecurity" */ "views/enterpriseSecurity/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "enterpriseSecurity" */ "views/enterpriseSecurity/index.vue"
      );

const riskWarning = is16
  ? () =>
      import(
        /* webpackChunkName: "riskWarning" */ "views/riskWarning/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "riskWarning" */ "views/riskWarning/index.vue"
      );

const riskWarning2 = is16
  ? () =>
      import(
        /* webpackChunkName: "riskWarning2" */ "views/riskWarning2/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "riskWarning2" */ "views/riskWarning2/index.vue"
      );

const targetMonitor = is16
  ? () =>
      import(
        /* webpackChunkName: "targetMonitor" */ "views/targetMonitor/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "targetMonitor" */ "views/targetMonitor/index.vue"
      );

const IntegratedCircuit = is16
  ? () =>
      import(
        /* webpackChunkName: "IntegratedCircuit" */ "views/IntegratedCircuit/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "IntegratedCircuit" */ "views/IntegratedCircuit/index.vue"
      );

const EnterpriseRisk = is16
  ? () =>
      import(
        /* webpackChunkName: "EnterpriseRisk" */ "views/enterpriseRisk/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "EnterpriseRisk" */ "views/enterpriseRisk/index.vue"
      );
const EnterpriseRiskNew = is16
  ? () =>
      import(
        /* webpackChunkName: "EnterpriseRiskNew" */ "views/enterpriseRisk-new/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "EnterpriseRiskNew" */ "views/enterpriseRisk-new/index.vue"
      );
const GDSecurity = is16
  ? () =>
      import(
        /* webpackChunkName: "GDSecurity" */ "views/gdsecurity/index16.vue"
      )
  : () =>
      import(/* webpackChunkName: "GDSecurity" */ "views/gdsecurity/index.vue");

const keyMonitoring = is16
  ? () =>
      import(
        /* webpackChunkName: "keyMonitoring" */ "views/keyMonitoring/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "keyMonitoring" */ "views/keyMonitoring/index.vue"
      );

const keyMonitoring2 = is16
  ? () =>
      import(
        /* webpackChunkName: "keyMonitoring" */ "views/keyMonitoring-new/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "keyMonitoring" */ "views/keyMonitoring-new/index.vue"
      );

const MainChains = is16
  ? () =>
      import(
        /* webpackChunkName: "mainChains" */ "views/mainChains/index16.vue"
      )
  : () =>
      import(/* webpackChunkName: "mainChains" */ "views/mainChains/index.vue");

const keyGuarantee = () =>
  import(/* webpackChunkName: "keyGuarantee" */ "views/keyGuarantee/index.vue");

const specialMonitoring2 = is16
  ? () =>
      import(
        /* webpackChunkName: "specialMonitoring2" */ "views/specialMonitoring2/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "specialMonitoring2" */ "views/specialMonitoring2/index.vue"
      );

const importTaskServe = is16
  ? () =>
      import(
        /* webpackChunkName: "importTaskServe" */ "views/importTaskServe/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "importTaskServe" */ "views/importTaskServe/index.vue"
      );

const industryNetworkSecurity = is16
  ? () =>
      import(
        /* webpackChunkName: "industryNetworkSecurity" */ "views/industrynetworksecurity/index16.vue"
      )
  : () =>
      import(
        /* webpackChunkName: "industryNetworkSecurity" */ "views/industrynetworksecurity/index.vue"
      );

export default [
  {
    path: "/",
    redirect: "/architecture",
    meta: {
      title: "国家级工业互联网安全监测与态势感知平台",
    },
    component: Layout,
    children: [
      {
        path: "/architecture",
        menuCode: "architecture",
        meta: {
          title: "总体架构",
          icon: "",
          hidden: false,
        },
        component: Architecture,
      },
      {
        path: "/situation",
        menuCode: "macroSituation",
        meta: {
          title: "宏观态势",
          icon: "",
          hidden: false,
        },
        redirect: "/networksecurity",
        component: WrapperView,
        children: [
          {
            path: "/networksecurity",
            menuCode: "networksecurity",
            meta: {
              title: "网络安全态势",
              icon: "",
              hidden: false,
            },
            component: networksecurity,
          },
          {
            path: "/datasecurity",
            menuCode: "datasecurity",
            meta: {
              title: "数据安全态势",
              icon: "",
              hidden: false,
            },
            component: datasecurity,
          },
          {
            path: "/enterpriseSecurity",
            menuCode: "enterpriseSecurity",
            meta: {
              title: "企业安全态势",
              icon: "",
              hidden: false,
            },
            component: enterpriseSecurity,
          },
          {
            path: "/gdsecurity",
            menuCode: "gdsecurity",
            meta: {
              title: "整体安全态势",
              icon: "",
              hidden: true,
            },
            component: GDSecurity,
          },
        ],
      },
      {
        path: "/targetMonitor",
        menuCode: "directionalMonitoring",
        meta: {
          title: "监测赋能",
          icon: "",
          hidden: false,
        },
        component: WrapperView,
        redirect: "/importTaskServe",
        children: [
          {
            path: "/importTaskServe",
            menuCode: "importTaskServe",
            meta: {
              title: "重保任务支撑",
              icon: "",
              hidden: false,
            },
            component: importTaskServe,
          },
          {
            path: "/keyGuarantee",
            menuCode: "keyGuarantee",
            meta: {
              title: "重保任务支撑服务",
              icon: "",
              hidden: false,
            },
            component: targetMonitor,
          },
          {
            path: "/mainChains",
            menuCode: "mainChains",
            meta: {
              title: "重点行业监测赋能",
              icon: "",
              hidden: false,
            },
            component: MainChains,
          },
          {
            path: "/industryNetworkSecurity",
            menuCode: "industryNetworkSecurity",
            meta: {
              title: "原材料工业安全态势",
              icon: "",
              hidden: true,
            },
            component: industryNetworkSecurity,
          },
          {
            path: "/integratedCircuit",
            menuCode: "integratedCircuit",
            meta: {
              title: "重点监测专题",
              icon: "",
              hidden: true,
            },
            component: IntegratedCircuit,
          },
          {
            path: "/keyMonitoring",
            menuCode: "keyMonitoring",
            meta: {
              title: "重点监测专题",
              icon: "",
              hidden: true,
            },
            component: keyMonitoring,
          },
          {
            path: "/keyMonitoring2",
            menuCode: "keyMonitoring2",
            meta: {
              title: "重点监测专题",
              icon: "",
              hidden: true,
            },
            component: keyMonitoring2,
          },
          {
            path: "/specialMonitoring",
            menuCode: "specialMonitoring",
            meta: {
              title: "专项监测",
              icon: "",
              hidden: true,
            },
            component: specialMonitoring,
          },
          {
            path: "/specialMonitoring2",
            menuCode: "specialMonitoring2",
            meta: {
              title: "专项监测",
              icon: "",
              hidden: true,
            },
            component: specialMonitoring2,
          },
          {
            path: "/keyGuaranteeInfo",
            menuCode: "keyGuaranteeInfo",
            meta: {
              title: "重点保障",
              icon: "",
              hidden: false,
            },
            component: keyGuarantee,
          },
        ],
      },
      {
        path: "/riskWarning",
        menuCode: "riskWarning",
        meta: {
          title: "风险预警",
          icon: "",
          hidden: false,
        },
        component: riskWarning2,
      },
      {
        path: "/basicdata",
        menuCode: "basicdata",
        meta: {
          title: "基础数据",
          icon: "",
          hidden: false,
        },
        component: basicdata,
      },
      {
        path: "/enterpriseRisk",
        menuCode: "enterpriseRisk",
        meta: {
          title: "企业风险画像",
          icon: "",
          hidden: true,
        },
        component: EnterpriseRisk,
      },
      {
        path: "/enterpriseRisk2",
        menuCode: "enterpriseRisk2",
        meta: {
          title: "企业风险画像",
          icon: "",
          hidden: true,
        },
        component: EnterpriseRiskNew,
      },
      {
        path: "/abroadAttackerThreat",
        menuCode: "abroadAttackerThreat",
        meta: {
          title: "境外攻击者威胁画像",
          icon: "",
          hidden: true,
        },
        component: abroadAttackerThreat,
      },
      // {
      //   path: "/controldevice",
      //   menuCode: "controldevice",
      //   meta: {
      //     title: "控制与设备",
      //     icon: "",
      //     hidden: false,
      //   },
      //   component: controldevice,
      // },
      // {
      //   path: "/securitypower",
      //   menuCode: "securitypower",
      //   meta: {
      //     title: "安全赋能",
      //     icon: "",
      //     hidden: false,
      //   },
      //   component: securitypower,
      // },
      // {
      //   path: "/specialMonitoring",
      //   menuCode: "specialMonitoring",
      //   meta: {
      //     title: "专项监测",
      //     icon: "",
      //     hidden: false,
      //   },
      //   component: specialMonitoring,
      // },
      // {
      //   path: "/demo",
      //   menuCode: "demo",
      //   meta: {
      //     title: "样例",
      //     icon: "",
      //     hidden: false,
      //   },
      //   component: demo,
      // },
    ],
  },
];

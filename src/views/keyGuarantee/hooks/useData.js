import { ref, onBeforeMount, onMounted } from "vue";

export function useData() {
  const overviewData1 = ref([1234, 1234]);
  const overviewData2 = ref([3213, 231]);
  const overviewData3 = ref([1231, 3123]);

  const companyList = ref([
    {
      name: "中国石油化工股份有限公司",
      time: "2025-10-19",
      ip: "106.15.176.37",
      event: "漏洞利用攻击成功",
      warning: "核心数据被窃取",
    },
    {
      name: "中国石油天然气集团有限公司",
      time: "2025-09-12",
      ip: "123.57.89.21",
      event: "暴力破解企图",
      warning: "账户安全存在风险",
    },
    {
      name: "中国中车股份有限公司",
      time: "2025-08-03",
      ip: "39.105.67.142",
      event: "网络扫描异常",
      warning: "外部端口暴露过多",
    },
    {
      name: "中国船舶集团有限公司",
      time: "2025-07-22",
      ip: "8.210.45.199",
      event: "DDoS攻击",
      warning: "核心业务系统响应变慢",
    },
    {
      name: "中国电子科技集团有限公司",
      time: "2025-06-15",
      ip: "52.82.14.77",
      event: "钓鱼邮件传播",
      warning: "内部邮箱遭批量投递",
    },
    {
      name: "中国航天科技集团有限公司",
      time: "2025-05-28",
      ip: "101.200.33.188",
      event: "渗透提权",
      warning: "服务器存在高危漏洞",
    },
    {
      name: "比亚迪股份有限公司",
      time: "2025-04-10",
      ip: "43.154.76.9",
      event: "恶意外联",
      warning: "检测到异常对外连接",
    },
    {
      name: "海尔智家股份有限公司",
      time: "2025-03-19",
      ip: "13.229.45.231",
      event: "木马后门",
      warning: "主机安全受影响",
    },
    {
      name: "宁德时代新能源科技股份有限公司",
      time: "2025-02-06",
      ip: "54.179.203.17",
      event: "数据泄露风险",
      warning: "敏感数据疑似外泄",
    },
  ]);

  onBeforeMount(() => {});

  onMounted(() => {});
  return {
    overviewData1,
    overviewData2,
    overviewData3,
    companyList,
  };
}

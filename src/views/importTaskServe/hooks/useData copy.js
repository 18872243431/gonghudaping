import { ref, onBeforeMount } from "vue";
import { getGuaranteeList, getGuaranteeList2, getDetail } from "@/api/keyGuarantee";
import { guaranteeList2 ,guaranteeListDetail} from "./data.json";

export function useData() {
  const total = ref({ doingCount: 0, doneCount: 0, totalCount: 0 });

  const list1 = ref([]);

  const list2 = ref([
    {
      id: 101,
      name: "中华人民共和国第十五届运动会",
      status: "2",
      time: "2024-01-01 - 2024-01-15",
      metrics: {
        objCount: 12,
        ipCount: 45,
        domainCount: 10,
        attackCount: 150,
        riskType: "无",
        harm: "无",
        desc: "发现风险并阻断"
      },
      imgUrl: "",
      desc: "risk_found"
    },
    {
      id: 102,
      name: "数实融合演练",
      status: "2",
      time: "2024-03-01 - 2024-03-10",
      metrics: {
        objCount: 56,
        ipCount: 128,
        domainCount: 25,
        attackCount: 320,
        riskType: "演练攻击",
        harm: "模拟数据泄露",
        desc: "输出监测报告"
      },
      imgUrl: "",
      desc: "digital_fusion"
    },
    {
      id: 103,
      name: "十四届全国人大三次会议",
      status: "2",
      time: "2024-05-01 - 2024-05-05",
      metrics: {
        objCount: 89,
        ipCount: 210,
        domainCount: 50,
        attackCount: 0,
        riskType: "漏洞利用",
        harm: "远程控制、敏感信息泄露",
        desc: "未发现安全事件"
      },
      attackedIp: "218.57.139.142",
      detailInfo: {
        feature: {
          abnormalFeatures: [
            "异常 Nacos 管理接口访问行为，未经过身份校验直接获取管理员权限",
            "可疑 JWT 默认 Token 使用特征，本地会话伪造 accessToken 实现后台越权登录"
          ],
          tableList: [
            {
              srcIp: "121.41.24.66",
              num: 48,
              time: "2025-09-15 15:12:26",
              dstIp: "218.57.139.142"
            },
            {
              srcIp: "121.41.24.66",
              num: 12,
              time: "2025-09-15 16:12:26",
              dstIp: "218.57.139.142"
            },
            {
              srcIp: "121.41.24.66",
              num: 82,
              time: "2025-09-16 14:12:26",
              dstIp: "218.57.139.142"
            }
          ],
          actualAlarm: [
            "检测到异常Nacos管理接口访问行为，疑似身份认证绕过。",
            "捕获默认 JWT Token 会话特征，存在越权访问风险。"
          ]
        },
        report: {
          found_time: "2025-09-15 15:12:26-2025-09-16 14:12:26",
          event_type: "攻击类型:漏洞利用",
          reportName: "风险预警分析报告_山东重工集团有限公司（漏洞利用）--2025年9月16日.docx",
          advice: "处置意见:\n1.立即下线或隔离暴露的 Nacos 服务，限制管理接口的外网访问，防止进一步被利用。\n2.立刻修复身份认证配置问题，升级至安全版本并更换相关密钥、Token 与账号密码。\n3.全面排查 Nacos 及关联系统日志，核查是否存在未授权配置变更、数据泄露或横向渗透行为。",
          attack_ip: "121.41.24.66",
          attacked_ip: "218.57.139.142",
          status: "未通报"
        },
        title: {
          headline1: "攻击特征特征检测",
          headline2: "情报关联分析",
          headline3: "自动生成分析报告",
          title1: "攻击日志",
          title2: "异常特征",
          title3: "实时警报",
          title4: "威胁情报匹配",
          title5: "危害分析",
          label1: "攻击特征",
          title6: "自动生成分析报告",
          label2: "漏洞匹配",
          title7: "处置建议"
        },
        intelligence: {
          attackInfo: "攻击者在发现对外暴露的 Nacos 服务后，利用认证校验缺失或默认密钥，构造携带 globalAdmin=true 的 JWT Token 注入会话或请求头，绕过登录校验并获取管理员权限。",
          analyse: "攻击者可通过该漏洞获取数据库账号密码，进而窃取业务数据，并以此为跳板横向渗透至生产网络，控制生产系统、影响产线设备运行。",
          type: [
            "配置缺陷",
            "权限绕过"
          ],
          family: {
            level: "高危",
            type: "Nacos 身份认证绕过",
            ratio: "95%"
          }
        }
      },
      attackNum: "371",
      eventType: "漏洞利用",
      damageLevel: "高危",
      details: [
        { stage: "监测发现", content: "通过工业互联网安全监测平台，发现针对XX系统的异常访问流量，初步研判为漏洞探测行为。" },
        { stage: "分析研判", content: "结合威胁情报，确认该IP为境外已知攻击源。分析流量特征，确定攻击者正利用CVE-2023-XXXX漏洞进行渗透。" },
        { stage: "处置恢复", content: "立即下发封禁指令，阻断攻击源IP。同步通知相关单位修复漏洞，并加强流量审计。" }
      ],
      imgUrl: "",
      desc: "no_risk"
    }
  ]);

  async function getTotal() {
    const res = await getGuaranteeList();
    if (res.code === 0) {
      total.value = res.data;
    }
    // total.value = { doingCount: 3, doneCount: 5, totalCount: 8 };
  }

  async function getList1() {
    // const res = await getGuaranteeList2();  
    const res = guaranteeList2;
    if (res.code === 0) {
      const list = res.data.map((item) => ({
        ...item,
        name: item.eventName,
        status: item.eventStatus,
        time: item.startTime.slice(0, 10) + " - " + item.endTime.slice(0, 10),
      }));
      // Sort by startTime descending
      list.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      list1.value = list;
    }
  }

  async function getList2() {
    // const res = await getDetail({wdId:'important_event_mission'});
    const res = guaranteeListDetail;
    if (res.code === 0) {
      list2.value = res.data.data.map((item, index) => {
        let desc = "";
        if (index === 0) desc = "risk_found";
        else if (index === 1) desc = "digital_fusion";
        else if (index === 2) desc = "no_risk";

        return {
          id: item.detail.detailType,
          name: item.basicInfo.taskName,
          status: item.basicInfo.status === "已结束" ? 2 : 1,
          time: item.basicInfo.timeRange,
          metrics: item.basicInfo,
          detail: item.detail,
          imgUrl: "",
          desc: desc
        };
      });
    }
  }

  onBeforeMount(() => {
    getList2();
    getTotal();
    getList1();
  });

  return {
    total,
    list1,
    list2,
  };
}

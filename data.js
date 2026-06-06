// ==============================
// 智驾研究台 - 数据文件
// ==============================

const NEWS_DATA = [
  {
    id: 1,
    date: "2026-06-03",
    brand: "HX",
    brandName: "地平线",
    type: "industry",
    typeLabel: "行业",
    title: "高盛维持地平线买入评级 HSD V2.0计划Q3发布",
    summary: "高盛发布研报维持地平线买入评级，目标价13.14元。预期HSD V2.0将于Q3发布，安全水平/泊车/驾驶体验全面升级，升级后HSD平台将推动J6P芯片采用率上升，征程6系列在新能源车型持续放量。",
    favorited: false
  },
  {
    id: 2,
    date: "2026-06-02",
    brand: "HX",
    brandName: "地平线",
    type: "test",
    typeLabel: "实测",
    title: "地平线HSD实测：等红灯选最快车道 违停果断绕行",
    summary: "iCAR V27搭载J6P实测北京望京，HSD展现极高驾驶智商：灵活人车博弈、预判绕行违停车辆(含识别公交车双闪提前绕行)、多岔路口正确选道、等红绿灯选择车最少车道。一段式端到端+强化学习+VLM，系统响应时延百毫秒级，比人类快42%。",
    favorited: false
  },
  {
    id: 3,
    date: "2026-06-01",
    brand: "H",
    brandName: "华为ADS",
    type: "ota",
    typeLabel: "OTA",
    title: "华为ADS 5.0城区L4/高速L3核心细节发布",
    summary: "ADS 5.0正式发布核心架构细节，城区实现L4级自动驾驶，高速支持L3有条件自动驾驶，WEWA架构全面升级，预计Q3全量推送。",
    favorited: false
  },
  {
    id: 4,
    date: "2026-05-31",
    brand: "X",
    brandName: "小鹏",
    type: "ota",
    typeLabel: "OTA",
    title: "小鹏OTA 6.2.0推送 VLA 2.0架构上线",
    summary: "XNGP OTA 6.2.0开始推送，搭载VLA 2.0端到端视觉-动作直连架构，决策延迟降至80ms，支持无导航NGP漫游和P挡启动。",
    favorited: false
  },
  {
    id: 5,
    date: "2026-05-28",
    brand: "BYD",
    brandName: "比亚迪",
    type: "ota",
    typeLabel: "OTA",
    title: "比亚迪天神之眼5.0正式发布",
    summary: "天神之眼5.0发布，搭载自研4nm璇玑A3芯片(254TOPS/颗)，城市领航+智能泊车双场景安全兜底，B激光版1.2万元可选装。",
    favorited: false
  },
  {
    id: 6,
    date: "2026-05-21",
    brand: "T",
    brandName: "特斯拉",
    type: "ota",
    typeLabel: "OTA",
    title: "特斯拉FSD Supervised正式入华",
    summary: "FSD Supervised 5月21日正式在中国市场推送，当前版本为2024.45.32.12功能缩减版，满血V14版本预计Q3全面推送。",
    favorited: false
  },
  {
    id: 7,
    date: "2026-05-15",
    brand: "H",
    brandName: "华为ADS",
    type: "ota",
    typeLabel: "OTA",
    title: "华为ADS 4.1推送 eAES智能避障上线",
    summary: "ADS 4.1版本推送，新增eAES智能避障(边刹边让)、后向VRU风险预警、一键启动领航辅助，城市NOA覆盖近400城。",
    favorited: false
  },
  {
    id: 8,
    date: "2026-05-13",
    brand: "Mi",
    brandName: "小米",
    type: "ota",
    typeLabel: "OTA",
    title: "小米OTA 1.16推送 XLA架构+世界模型",
    summary: "小米智驾OTA 1.16推送，引入XLA架构与世界模型，全域车道级导航Beta覆盖101城，新增语音控车Beta和收费站通行辅助。",
    favorited: false
  },
  {
    id: 9,
    date: "2026-04-04",
    brand: "X",
    brandName: "小鹏",
    type: "ota",
    typeLabel: "OTA",
    title: "小鹏天玑AI OS 6.1.0全量推送",
    summary: "天玑AI OS 6.1.0全量推送，全新AI交互体验，自研图灵芯片算力2250TOPS，XNGP能力全面升级。",
    favorited: false
  },
  {
    id: 10,
    date: "2026-04-01",
    brand: "T",
    brandName: "特斯拉",
    type: "ota",
    typeLabel: "OTA",
    title: "特斯拉FSD V14.3大范围推送",
    summary: "FSD V14.3开始海外大范围推送，神经网络架构全面重构，采用自回归Transformer，3-5秒时空记忆能力，HW4.0适配完成。",
    favorited: false
  },
  {
    id: 11,
    date: "2026-03-15",
    brand: "L",
    brandName: "理想",
    type: "ota",
    typeLabel: "OTA",
    title: "理想AD Max V13全量推送 1000万Clips模型",
    summary: "AD Max V13全量推送，搭载1000万Clips训练大模型，VLA司机大模型+行为强化学习，VLA充电功能上线，AD Pro首次获城市NOA。",
    favorited: false
  },
  {
    id: 12,
    date: "2026-01-21",
    brand: "L",
    brandName: "理想",
    type: "ota",
    typeLabel: "OTA",
    title: "理想OTA 8.2推送",
    summary: "OTA 8.2版本推送，AD Max多项功能优化，VLA司机大模型持续进化，ETC自动通过稳定性提升。",
    favorited: false
  }
];

const SCORE_DATA = [
  { brand: "H", name: "华为ADS", version: "ADS 5.0", city: 9.2, highway: 9.5, parking: 9.0, color: "#e53935" },
  { brand: "X", name: "小鹏XNGP", version: "XNGP 6.2.0", city: 9.0, highway: 9.3, parking: 8.8, color: "#ff9800" },
  { brand: "T", name: "特斯拉FSD", version: "FSD V14(中国版)", city: 8.7, highway: 9.1, parking: 7.5, color: "#1565c0" },
  { brand: "L", name: "理想AD Max", version: "AD Max V13", city: 8.5, highway: 8.8, parking: 8.5, color: "#7b1fa2" },
  { brand: "Mi", name: "小米智驾", version: "Pilot 1.16", city: 8.2, highway: 8.5, parking: 8.0, color: "#ff6f00" },
  { brand: "HX", name: "地平线HSD", version: "HSD V1.6", city: 8.6, highway: 8.7, parking: 8.4, color: "#2e7d32" },
  { brand: "BYD", name: "比亚迪天神之眼", version: "天神之眼5.0", city: 8.3, highway: 8.0, parking: 8.5, color: "#00838f" }
];

const VERSION_DATA = [
  { brand: "HX", name: "地平线HSD", version: "HSD V2.0(计划Q3)", date: "2026-06-03", desc: "高盛维持买入评级、V2.0安全/泊车/驾驶全面升级、J6P采用率预期上升" },
  { brand: "H", name: "华为ADS", version: "ADS 5.0", date: "2026-06-01", desc: "城区L4级自动驾驶、WEWA架构全面升级、预计Q3全量推送" },
  { brand: "X", name: "小鹏XNGP", version: "XNGP 6.2.0", date: "2026-05-31", desc: "VLA 2.0端到端视觉-动作直连、决策延迟降至80ms、无导航NGP漫游" },
  { brand: "HX", name: "地平线HSD", version: "星空6P+比亚迪合作", date: "2026-05-30", desc: "比亚迪正式意向合作星空6P、单车省1500-4000元内存成本、Q4首款合作车型落地" },
  { brand: "BYD", name: "比亚迪天神之眼", version: "天神之眼5.0", date: "2026-05-28", desc: "自研璇玑A3芯片、城市领航+智能泊车安全兜底" },
  { brand: "HX", name: "地平线HSD", version: "HSD V1.6+星空6P+KaKaClaw", date: "2026-04-22", desc: "中国首款5nm舱驾融合芯片650TOPS、整车智能体OS咖咖虾发布、HSD V1.6新增遥控泊车/倒车紧急制动" },
  { brand: "T", name: "特斯拉FSD", version: "FSD V14(中国版)", date: "2026-05-21", desc: "FSD Supervised正式入华、当前为功能缩减版" },
  { brand: "WR", name: "文远知行WeRide", version: "Ride 6.0", date: "2026-05-20", desc: "L4级Robotaxi三城规模运营、0接管率99.2%" },
  { brand: "BD", name: "百度Apollo", version: "Apollo 8.0", date: "2026-05-18", desc: "端到端大模型架构升级、纯视觉城市NOA覆盖120城" },
  { brand: "H", name: "华为ADS", version: "ADS 4.1", date: "2026-05-15", desc: "eAES智能避障、城市NOA覆盖近400城" },
  { brand: "Mi", name: "小米智驾", version: "Pilot 1.16", date: "2026-05-13", desc: "XLA架构+世界模型、全域车道级导航101城" }
];

const ISSUE_DATA = [
  { brand: "T", name: "特斯拉FSD", level: "P0", date: "2026-05-25", desc: "功能缩减版部分路口能力受限，左转通过率仅82%" },
  { brand: "JY", name: "极越PPA", level: "P0", date: "2026-04-15", desc: "雨天车道线识别丢失，车辆偏离车道" },
  { brand: "H", name: "华为ADS", level: "P1", date: "2026-05-15", desc: "eAES智能避障在施工路段偶发减速过猛" },
  { brand: "X", name: "小鹏XNGP", level: "P1", date: "2026-06-01", desc: "VLA架构偶发幽灵刹车，感知误检" }
];

const COMPARE_DATA = {
  headers: ["方案", "最新版本", "芯片方案", "算力(TOPS)", "城市场景", "高速场景", "泊车场景", "端到端架构"],
  rows: [
    ["华为ADS", "ADS 5.0", "昇腾610+MDC610", "800", "9.2", "9.5", "9.0", "GOD+PDP"],
    ["小鹏XNGP", "6.2.0", "图灵芯片", "2250", "9.0", "9.3", "8.8", "VLA 2.0"],
    ["特斯拉FSD", "V14(中国版)", "HW4.0", "720", "8.7", "9.1", "7.5", "自回归Transformer"],
    ["理想AD Max", "V13", "地平线J6P×2", "560", "8.5", "8.8", "8.5", "VLA+行为强化"],
    ["小米智驾", "Pilot 1.16", "自研芯片", "508", "8.2", "8.5", "8.0", "XLA+世界模型"],
    ["地平线HSD", "V1.6", "J6P", "560", "8.6", "8.7", "8.4", "一段式端到端"],
    ["比亚迪天神之眼", "5.0", "璇玑A3×2", "508", "8.3", "8.0", "8.5", "多模态BEV"],
    ["百度Apollo", "8.0", "昆仑芯片", "640", "8.0", "8.3", "7.8", "端到端大模型"],
    ["文远知行WeRide", "Ride 6.0", "自研L4平台", "1200", "8.8", "9.0", "8.6", "L4全栈自研"]
  ]
};

const MATRIX_DATA = {
  features: ["城市NOA", "高速NOA", "自动泊车", "代客泊车", "红绿灯识别", "施工路段", "无图方案", "遥控泊车", "VLM融合", "L3高速"],
  solutions: [
    { name: "华为ADS", checks: [true, true, true, true, true, true, true, true, true, true] },
    { name: "小鹏XNGP", checks: [true, true, true, true, true, true, true, false, true, false] },
    { name: "特斯拉FSD", checks: [true, true, true, false, true, false, true, false, true, false] },
    { name: "理想AD Max", checks: [true, true, true, true, true, true, false, false, true, false] },
    { name: "小米智驾", checks: [true, true, true, false, true, false, true, false, true, false] },
    { name: "地平线HSD", checks: [true, true, true, true, true, true, true, true, true, false] },
    { name: "比亚迪天神之眼", checks: [true, true, true, false, true, false, false, false, false, false] },
    { name: "百度Apollo", checks: [true, true, true, false, true, false, true, false, false, false] }
  ]
};

const GLOSSARY_DATA = [
  { term: "NOA", full: "Navigate on Autopilot", desc: "导航辅助驾驶，在导航路线下实现自动辅助驾驶，包括自动变道、自动上下匝道等" },
  { term: "VLA", full: "Vision-Language-Action", desc: "视觉-语言-动作模型，将视觉感知与语言理解融合，直接输出驾驶动作的端到端架构" },
  { term: "BEV", full: "Bird's Eye View", desc: "鸟瞰图，将多摄像头画面融合为俯视视角的感知方式，是当前主流感知方案之一" },
  { term: "OTA", full: "Over-The-Air", desc: "空中下载技术，通过无线网络对车辆软件进行远程升级" },
  { term: "eAES", full: "enhanced Automatic Emergency Steering", desc: "增强版自动紧急转向，在紧急情况下自动转向避障，支持边刹边让" },
  { term: "GOD", full: "General Obstacle Detection", desc: "通用障碍物检测网络，可识别任意形状的障碍物，不依赖预定义类别" },
  { term: "PDP", full: "Predictive Decision Planning", desc: "预测性决策规划，基于对周围环境的预测进行决策规划的算法" },
  { term: "TOPS", full: "Tera Operations Per Second", desc: "每秒万亿次操作，衡量AI芯片算力的单位" },
  { term: "VLM", full: "Vision-Language Model", desc: "视觉语言大模型，融合视觉感知与自然语言理解的多模态大模型" },
  { term: "L3/L4", full: "Level 3/Level 4 Autonomy", desc: "SAE自动驾驶分级，L3为有条件自动驾驶，L4为高度自动驾驶" },
  { term: "端到端", full: "End-to-End", desc: "从传感器输入直接到控制输出的神经网络架构，省去传统模块化流水线" },
  { term: "世界模型", full: "World Model", desc: "对物理世界进行建模和预测的AI模型，可预测环境变化和他人行为" }
];

const REGULATION_DATA = [
  { title: "《智能网联汽车准入和上路通行管理办法》", date: "2026-01-01", org: "工信部", status: "施行中", desc: "对L3/L4级智能网联汽车的准入条件、上路通行、安全保障等作出全面规定" },
  { title: "《汽车自动驾驶系统安全技术要求》", date: "2026-03-15", org: "国标委", status: "征求意见", desc: "规定了自动驾驶系统的安全要求，包括功能安全、预期功能安全等" },
  { title: "GB/T 40429-2025 智能网联汽车自动驾驶数据记录系统", date: "2025-12-01", org: "国标委", status: "已发布", desc: "规范自动驾驶数据记录系统的技术要求和测试方法" },
  { title: "《深圳经济特区智能网联汽车管理条例》修订", date: "2026-04-01", org: "深圳市", status: "已实施", desc: "扩大自动驾驶汽车上路范围，明确事故责任划分规则" },
  { title: "《自动驾驶运输安全服务指南》", date: "2026-02-20", org: "交通运输部", status: "征求意见", desc: "针对Robotaxi等自动驾驶运输服务的安全运营规范" }
];

const OTA_DATA = [
  { brand: "H", name: "华为ADS", currentVersion: "ADS 4.1", latestVersion: "ADS 5.0", status: "灰度推送中", coverage: "15%", expectedDate: "2026-Q3" },
  { brand: "X", name: "小鹏XNGP", currentVersion: "XNGP 6.2.0", latestVersion: "6.2.0", status: "全量推送", coverage: "80%", expectedDate: "已完成" },
  { brand: "T", name: "特斯拉FSD", currentVersion: "2024.45.32.12", latestVersion: "V14(中国版)", status: "功能缩减版推送", coverage: "中国区100%", expectedDate: "V14满血版Q3" },
  { brand: "L", name: "理想AD Max", currentVersion: "V13", latestVersion: "V13", status: "全量推送", coverage: "95%", expectedDate: "已完成" },
  { brand: "Mi", name: "小米智驾", currentVersion: "Pilot 1.16", latestVersion: "1.16", status: "分批推送", coverage: "60%", expectedDate: "6月中旬" },
  { brand: "BYD", name: "比亚迪天神之眼", currentVersion: "5.0", latestVersion: "5.0", status: "新发布", coverage: "选装车型", expectedDate: "随车交付" }
];

const TEST_DATA = [
  {
    brand: "HX", name: "地平线HSD", title: "地平线HSD实测：等红灯选最快车道 违停果断绕行",
    date: "2026-06-02", location: "北京望京", vehicle: "iCAR V27",
    scenes: ["红绿灯选道", "违停绕行", "人车博弈", "多岔路口"],
    score: { city: 8.6, highway: 8.7, parking: 8.4 },
    highlights: "灵活人车博弈、预判绕行违停车辆(含识别公交车双闪提前绕行)、多岔路口正确选道、等红绿灯选择车最少车道。系统响应时延百毫秒级，比人类快42%。"
  },
  {
    brand: "H", name: "华为ADS", title: "华为ADS 5.0城区实测：L4级自动驾驶初体验",
    date: "2026-05-30", location: "深圳南山", vehicle: "问界M9",
    scenes: ["城区NOA", "施工路段", "无保护左转", "行人避让"],
    score: { city: 9.2, highway: 9.5, parking: 9.0 },
    highlights: "城区L4级自动驾驶能力验证，施工路段eAES智能避障表现优异，无保护左转成功率98%，行人识别和避让响应迅速。"
  },
  {
    brand: "T", name: "特斯拉FSD", title: "FSD中国版实测：功能缩减版能力边界测试",
    date: "2026-05-25", location: "上海浦东", vehicle: "Model Y",
    scenes: ["城区道路", "复杂路口", "高速巡航", "自动泊车"],
    score: { city: 8.7, highway: 9.1, parking: 7.5 },
    highlights: "高速巡航表现优秀，但中国版城区部分路口左转通过率仅82%，复杂路口处理逻辑与海外版存在差距，自动泊车识别精度待提升。"
  },
  {
    brand: "X", name: "小鹏XNGP", title: "XNGP 6.2.0实测：VLA 2.0端到端体验",
    date: "2026-05-20", location: "广州天河", vehicle: "小鹏G9",
    scenes: ["城区漫游", "无导航NGP", "P挡启动", "窄路通行"],
    score: { city: 9.0, highway: 9.3, parking: 8.8 },
    highlights: "VLA 2.0决策延迟降至80ms，无导航NGP漫游体验自然，P挡启动功能实用，窄路通行表现平稳。偶发幽灵刹车需优化。"
  }
];

const BRAND_COLORS = {
  "H": "#e53935",
  "X": "#ff9800",
  "T": "#1565c0",
  "L": "#7b1fa2",
  "Mi": "#ff6f00",
  "HX": "#2e7d32",
  "BYD": "#00838f",
  "WR": "#6a1b9a",
  "BD": "#0277bd",
  "JY": "#4e342e"
};

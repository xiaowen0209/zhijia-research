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
  {
    brand: "HX", name: "地平线HSD", version: "HSD V2.0", date: "2026-06-03",
    chip: "征程6P (J6P)", arch: "一段式端到端 + 强化学习 + VLM",
    features: ["安全水平全面升级", "泊车体验优化", "驾驶体验升级", "J6P采用率预期上升"],
    scope: "计划中", riskLevel: "低",
    desc: "高盛维持买入评级，预期HSD V2.0将于Q3发布，安全水平/泊车/驾驶体验全面升级，升级后HSD平台将推动J6P芯片采用率上升"
  },
  {
    brand: "H", name: "华为ADS", version: "ADS 5.0", date: "2026-06-01",
    chip: "昇腾610 + MDC610", arch: "WEWA + GOD+PDP",
    features: ["城区L4级自动驾驶", "高速L3有条件自动驾驶", "WEWA架构全面升级", "预计Q3全量推送"],
    scope: "灰度", riskLevel: "低",
    desc: "ADS 5.0正式发布核心架构细节，城区实现L4级自动驾驶，高速支持L3有条件自动驾驶，WEWA架构全面升级，预计Q3全量推送"
  },
  {
    brand: "X", name: "小鹏XNGP", version: "XNGP 6.2.0", date: "2026-05-31",
    chip: "图灵芯片 (2250TOPS)", arch: "VLA 2.0 端到端视觉-动作直连",
    features: ["VLA 2.0架构上线", "决策延迟降至80ms", "无导航NGP漫游", "P挡启动"],
    scope: "全量", riskLevel: "低",
    desc: "XNGP OTA 6.2.0开始推送，搭载VLA 2.0端到端视觉-动作直连架构，决策延迟降至80ms，支持无导航NGP漫游和P挡启动"
  },
  {
    brand: "HX", name: "地平线HSD", version: "星空6P + 比亚迪合作", date: "2026-05-30",
    chip: "星空6P", arch: "一段式端到端",
    features: ["比亚迪正式意向合作星空6P", "单车省1500-4000元内存成本", "Q4首款合作车型落地"],
    scope: "计划中", riskLevel: "中",
    desc: "比亚迪正式意向合作星空6P芯片，单车可节省1500-4000元内存成本，Q4首款合作车型落地"
  },
  {
    brand: "BYD", name: "比亚迪天神之眼", version: "天神之眼5.0", date: "2026-05-28",
    chip: "自研4nm璇玑A3×2 (508TOPS)", arch: "多模态BEV + 安全兜底",
    features: ["自研4nm璇玑A3芯片(254TOPS/颗)", "城市领航+智能泊车双场景安全兜底", "B激光版1.2万元可选装"],
    scope: "新发布", riskLevel: "低",
    desc: "天神之眼5.0发布，搭载自研4nm璇玑A3芯片(254TOPS/颗)，城市领航+智能泊车双场景安全兜底，B激光版1.2万元可选装"
  },
  {
    brand: "HX", name: "地平线HSD", version: "HSD V1.6 + 星空6P + KaKaClaw", date: "2026-04-22",
    chip: "星空6P (中国首款5nm舱驾融合芯片 650TOPS)", arch: "一段式端到端 + 整车智能体OS",
    features: ["中国首款5nm舱驾融合芯片650TOPS", "整车智能体OS咖咖虾发布", "HSD V1.6新增遥控泊车", "倒车紧急制动"],
    scope: "灰度", riskLevel: "低",
    desc: "中国首款5nm舱驾融合芯片星空6P发布(650TOPS)，整车智能体OS咖咖虾发布，HSD V1.6新增遥控泊车/倒车紧急制动"
  },
  {
    brand: "T", name: "特斯拉FSD", version: "FSD V14 (中国版)", date: "2026-05-21",
    chip: "HW4.0 (720TOPS)", arch: "自回归Transformer",
    features: ["FSD Supervised正式入华", "当前为功能缩减版(2024.45.32.12)", "满血V14版本预计Q3全面推送"],
    scope: "灰度", riskLevel: "中",
    desc: "FSD Supervised 5月21日正式在中国市场推送，当前版本为2024.45.32.12功能缩减版，满血V14版本预计Q3全面推送"
  },
  {
    brand: "WR", name: "文远知行WeRide", version: "Ride 6.0", date: "2026-05-20",
    chip: "自研L4计算平台 (1200TOPS)", arch: "L4全栈自研",
    features: ["L4级Robotaxi三城规模运营", "0接管率99.2%", "商业化运营验证"],
    scope: "全量", riskLevel: "低",
    desc: "L4级Robotaxi三城规模运营，0接管率99.2%，商业化运营持续验证中"
  },
  {
    brand: "BD", name: "百度Apollo", version: "Apollo 8.0", date: "2026-05-18",
    chip: "昆仑芯片 (640TOPS)", arch: "端到端大模型",
    features: ["端到端大模型架构升级", "纯视觉城市NOA覆盖120城", "感知决策一体化"],
    scope: "全量", riskLevel: "低",
    desc: "端到端大模型架构升级，纯视觉城市NOA覆盖120城，感知决策一体化"
  },
  {
    brand: "H", name: "华为ADS", version: "ADS 4.1", date: "2026-05-15",
    chip: "昇腾610 + MDC610", arch: "GOD + PDP",
    features: ["eAES智能避障(边刹边让)", "后向VRU风险预警", "一键启动领航辅助", "城市NOA覆盖近400城"],
    scope: "全量", riskLevel: "低",
    desc: "ADS 4.1版本推送，新增eAES智能避障(边刹边让)、后向VRU风险预警、一键启动领航辅助，城市NOA覆盖近400城"
  },
  {
    brand: "Mi", name: "小米智驾", version: "Pilot 1.16", date: "2026-05-13",
    chip: "自研芯片 (508TOPS)", arch: "XLA + 世界模型",
    features: ["XLA架构上线", "世界模型引入", "全域车道级导航Beta覆盖101城", "语音控车Beta", "收费站通行辅助"],
    scope: "分批", riskLevel: "低",
    desc: "小米智驾OTA 1.16推送，引入XLA架构与世界模型，全域车道级导航Beta覆盖101城，新增语音控车Beta和收费站通行辅助"
  },
  {
    brand: "X", name: "小鹏XNGP", version: "天玑AI OS 6.1.0", date: "2026-04-04",
    chip: "图灵芯片 (2250TOPS)", arch: "端到端大模型",
    features: ["天玑AI OS全新交互", "自研图灵芯片算力2250TOPS", "XNGP能力全面升级"],
    scope: "全量", riskLevel: "低",
    desc: "天玑AI OS 6.1.0全量推送，全新AI交互体验，自研图灵芯片算力2250TOPS，XNGP能力全面升级"
  },
  {
    brand: "T", name: "特斯拉FSD", version: "FSD V14.3", date: "2026-04-01",
    chip: "HW4.0 (720TOPS)", arch: "自回归Transformer",
    features: ["神经网络架构全面重构", "采用自回归Transformer", "3-5秒时空记忆能力", "HW4.0适配完成"],
    scope: "全量(海外)", riskLevel: "低",
    desc: "FSD V14.3开始海外大范围推送，神经网络架构全面重构，采用自回归Transformer，3-5秒时空记忆能力，HW4.0适配完成"
  },
  {
    brand: "L", name: "理想AD Max", version: "AD Max V13", date: "2026-03-15",
    chip: "地平线J6P×2 (560TOPS)", arch: "VLA + 行为强化学习",
    features: ["1000万Clips训练大模型", "VLA司机大模型", "行为强化学习", "VLA充电功能上线", "AD Pro首次获城市NOA"],
    scope: "全量", riskLevel: "低",
    desc: "AD Max V13全量推送，搭载1000万Clips训练大模型，VLA司机大模型+行为强化学习，VLA充电功能上线，AD Pro首次获城市NOA"
  },
  {
    brand: "L", name: "理想AD Max", version: "OTA 8.2", date: "2026-01-21",
    chip: "地平线J6P×2 (560TOPS)", arch: "VLA司机大模型",
    features: ["AD Max多项功能优化", "VLA司机大模型持续进化", "ETC自动通过稳定性提升"],
    scope: "全量", riskLevel: "低",
    desc: "OTA 8.2版本推送，AD Max多项功能优化，VLA司机大模型持续进化，ETC自动通过稳定性提升"
  }
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
  // SAE自动驾驶分级
  { term: "L0", cat: "SAE分级", full: "Level 0 — No Automation", desc: "无自动化。车辆完全由驾驶员控制，系统仅提供警告和瞬时辅助（如前向碰撞预警、车道偏离预警），不持续控制车辆。" },
  { term: "L1", cat: "SAE分级", full: "Level 1 — Driver Assistance", desc: "驾驶辅助。系统能同时控制转向或加减速中的一项，如自适应巡航(ACC)或车道保持辅助(LKA)，驾驶员需全程监控。" },
  { term: "L2", cat: "SAE分级", full: "Level 2 — Partial Automation", desc: "部分自动化。系统能同时控制转向和加减速，但驾驶员必须持续监控并随时准备接管。代表：特斯拉Autopilot、小鹏XPILOT、蔚来NIO Pilot。" },
  { term: "L3", cat: "SAE分级", full: "Level 3 — Conditional Automation", desc: "有条件自动驾驶。特定条件下系统完成全部驾驶任务，驾驶员可以转移注意力但需在系统请求时及时接管。代表：奥迪A8 Traffic Jam Pilot、本田Legend。" },
  { term: "L4", cat: "SAE分级", full: "Level 4 — High Automation", desc: "高度自动驾驶。特定条件（限定区域/路线）内系统完成全部驾驶任务无需驾驶员介入。代表：Waymo Robotaxi、百度Apollo Robotaxi。" },
  { term: "L5", cat: "SAE分级", full: "Level 5 — Full Automation", desc: "完全自动驾驶。系统在任何条件下都能完成全部驾驶任务，无需人类干预。目前仍处于研发探索阶段，面临极端天气、复杂城市场景等挑战。" },

  // 感知系统
  { term: "CNN", cat: "感知系统", full: "Convolutional Neural Network", desc: "卷积神经网络，处理图像数据的核心深度学习算法，广泛应用于目标检测、车道线识别、语义分割等自动驾驶感知任务。代表架构：ResNet、YOLO、Faster R-CNN。" },
  { term: "BEV", cat: "感知系统", full: "Bird's Eye View", desc: "鸟瞰图感知，将多摄像头画面融合为俯视视角的感知方式，是当前主流感知方案之一。特斯拉、地平线等均采用BEV方案构建环境模型。" },
  { term: "GOD", cat: "感知系统", full: "General Obstacle Detection", desc: "通用障碍物检测网络，可识别任意形状的障碍物而不依赖预定义类别，解决传统目标检测对异形障碍物（如散落货物、事故碎片）识别困难的问题。" },
  { term: "激光雷达", cat: "感知系统", full: "LiDAR (Light Detection and Ranging)", desc: "通过发射激光脉冲并接收反射信号来测距，能精确获取目标三维空间信息。测量精度可达厘米级，角度分辨率可达0.1°。分为机械旋转式、固态式和混合固态式三种。" },
  { term: "毫米波雷达", cat: "感知系统", full: "Millimeter-Wave Radar", desc: "工作在30GHz-300GHz频段，精确测量目标距离、速度和角度。穿透雾烟能力强、测距精度高。24GHz用于短距，77GHz用于长距，是ACC和AEB的核心传感器。" },
  { term: "超声波传感器", cat: "感知系统", full: "Ultrasonic Sensor", desc: "用于近距离探测（0.2-5米），主要用于泊车辅助系统。成本低、可靠性高，是自动泊车功能的核心传感器之一。" },
  { term: "传感器融合", cat: "感知系统", full: "Sensor Fusion", desc: "将多种传感器（摄像头、雷达、LiDAR等）数据整合利用的技术。分为前融合（原始数据融合）和后融合（目标级融合），是提升感知系统能力的关键技术。" },
  { term: "VLA", cat: "感知系统", full: "Vision-Language-Action", desc: "视觉-语言-动作模型，将视觉感知与语言理解融合，直接输出驾驶动作的端到端架构。代表应用：理想AD Max V13、小鹏XNGP VLA 2.0。" },
  { term: "VLM", cat: "感知系统", full: "Vision-Language Model", desc: "视觉语言大模型，融合视觉感知与自然语言理解的多模态大模型，可理解复杂交通场景语义，提升自动驾驶的常识推理能力。" },
  { term: "SR", cat: "人机交互", full: "Situation Recognition", desc: "态势感知。将摄像头、雷达等传感器采集的信息可视化渲染显示，让用户直观了解系统「看到了」什么，增强对系统的信任感。" },

  // 定位系统
  { term: "GNSS", cat: "定位系统", full: "Global Navigation Satellite System", desc: "全球导航卫星系统，通过接收多颗卫星信号计算接收器位置。包括美国GPS、中国北斗、欧洲伽利略、俄罗斯格洛纳斯。是自动驾驶的基础定位手段。" },
  { term: "RTK", cat: "定位系统", full: "Real-Time Kinematic", desc: "实时动态差分定位技术，通过基准站发送修正信号，将定位精度提升至厘米级。是自动驾驶高精度定位的关键技术，需与惯性导航系统配合使用。" },
  { term: "INS", cat: "定位系统", full: "Inertial Navigation System", desc: "惯性导航系统，通过加速度计和陀螺仪测量车辆运动变化，计算位置和姿态。更新频率高、不受外部信号影响，是GNSS信号中断（如隧道）时的主要定位手段。" },
  { term: "高精地图", cat: "高精地图", full: "HD Map (High-Definition Map)", desc: "提供厘米级精度的道路信息，包含车道线、交通标志、路沿等丰富语义信息。分为道路层、定位层、关联层和动态层四层结构，是L3+自动驾驶的核心基础设施。" },
  { term: "SD地图", cat: "高精地图", full: "SD Map (Standard Definition Map)", desc: "标准地图，传统导航地图，精度为米级。用于日常导航，提供基础道路拓扑和POI信息，与高精地图配合使用。" },

  // 规划控制
  { term: "PNC", cat: "规划控制", full: "Planning and Control", desc: "规划与控制模块。包括全局路径规划、行为规划（决定做什么）、轨迹规划（生成具体行驶轨迹）、运动控制（执行规划指令）四个层次。" },
  { term: "MPC", cat: "规划控制", full: "Model Predictive Control", desc: "模型预测控制。根据车辆动力学模型预测未来状态，在每个控制周期求解最优控制指令。广泛应用于轨迹跟踪和运动控制，能处理多约束条件。" },
  { term: "端到端", cat: "规划控制", full: "End-to-End", desc: "从传感器输入直接到控制输出的神经网络架构，省去传统模块化流水线（感知→决策→规划→控制），以数据驱动方式实现自动驾驶。" },
  { term: "世界模型", cat: "规划控制", full: "World Model", desc: "对物理世界进行建模和预测的AI模型，可预测环境变化和他人行为。代表应用：特斯拉World Model、小米XLA架构中的世界模型。" },

  // V2X通信
  { term: "V2X", cat: "V2X通信", full: "Vehicle-to-Everything", desc: "车联网通信技术总称。包括V2V（车-车）、V2I（车-基础设施）、V2P（车-行人）、V2N（车-网络），突破单车感知局限，实现超视距信息获取。" },
  { term: "V2V", cat: "V2X通信", full: "Vehicle-to-Vehicle", desc: "车与车通信，车辆间直接交换位置、速度、意图等信息，实现碰撞预警、协同驾驶等功能。" },
  { term: "V2I", cat: "V2X通信", full: "Vehicle-to-Infrastructure", desc: "车与基础设施通信，车辆与路侧单元(RSU)交换信号灯信息、路况信息，实现信号灯预判、绿波通行等功能。" },
  { term: "V2N", cat: "V2X通信", full: "Vehicle-to-Network", desc: "车与网络通信，通过云端服务实现实时路况查询、远程诊断、OTA升级等功能。" },

  // 核心指标
  { term: "MPI", cat: "核心指标", full: "Miles Per Intervention", desc: "每次接管里程，衡量自动驾驶系统可靠性的核心指标。MPI越高表示系统越稳定可靠。安全MPI统计与安全相关的接管，效率MPI统计与效率相关的接管。" },
  { term: "MCP", cat: "核心指标", full: "Miles Per Intervention Coverage", desc: "每次接管里程覆盖率，按路段类型细分接管事件占比，识别系统在不同路段（高速/城区/施工区）的薄弱环节。" },
  { term: "接管", cat: "核心指标", full: "Disengagement / Intervention", desc: "驾驶员从自动驾驶系统手中收回车辆控制权的行为。分为安全接管（系统未识别风险）和效率接管（策略选择不当），是衡量系统性能的关键数据源。" },
  { term: "TOPS", cat: "核心指标", full: "Tera Operations Per Second", desc: "每秒万亿次操作，衡量AI芯片算力的标准单位。例如：特斯拉HW4.0为720TOPS，华为MDC610为800TOPS，小鹏图灵芯片为2250TOPS。" },
  { term: "NRR", cat: "核心指标", full: "No Recall Rate", desc: "设计运行域内的无召回率。衡量系统在ODD内正常完成驾驶任务而不需要人工干预的比例，是L4系统的关键准入指标。" },

  // 系统架构
  { term: "ROS", cat: "开发工具", full: "Robot Operating System", desc: "机器人操作系统，自动驾驶研发的核心框架。提供节点、话题、服务、动作等分布式通信机制，配套RViz可视化、Gazebo仿真等丰富工具生态。" },
  { term: "MCAP", cat: "开发工具", full: "MCAP (Message Container Archive Format)", desc: "消息容器存档格式，道路测试数据常用存储格式。支持图像、点云、雷达等多消息类型的高效存储和回放，是自动驾驶数据采集的标准格式。" },
  { term: "OTA", cat: "开发工具", full: "Over-The-Air", desc: "远程升级技术，通过无线网络远程更新车辆软件。是智能汽车「常用常新」的关键能力，可持续优化自动驾驶算法、修复问题、增加新功能。" },

  // 测试验证
  { term: "数据闭环", cat: "数据闭环", full: "Data Closed Loop", desc: "自动驾驶算法迭代的核心方法论：道路数据采集→云端标注处理→算法训练优化→车端验证→OTA推送→新数据采集的循环。决定系统持续进化能力。" },
  { term: "SIL", cat: "数据闭环", full: "Software-in-the-Loop", desc: "软件在环仿真，在纯软件环境中测试算法，成本最低、速度最快，适合大规模回归测试和参数调优。" },
  { term: "HIL", cat: "数据闭环", full: "Hardware-in-the-Loop", desc: "硬件在环仿真，连接真实硬件设备进行闭环测试，在仿真环境中验证真实硬件的表现，是SIL和实车测试之间的关键验证环节。" },
  { term: "通勤路线", cat: "数据闭环", full: "Commute Route", desc: "固定频率、日常高频使用的固定重复路线。路线稳定、复杂度可评估，是自动驾驶量产落地的核心场景。通勤路线的接管率直接决定用户体验。" },
  { term: "Corner Case", cat: "数据闭环", full: "Corner Case / Long-tail Scenario", desc: "长尾场景/极端情况。指发生概率极低但种类繁多的罕见场景（如路上突然出现的动物、异常障碍物、事故现场等），是自动驾驶安全验证的最大挑战。" },

  // 常见问题
  { term: "幽灵刹车", cat: "常见问题", full: "Phantom Braking", desc: "系统错误识别障碍物或危险目标导致的不必要紧急制动。是自动驾驶最常见的感知误检问题之一，严重影响驾乘体验和安全性。" },
  { term: "NOA/NOP", cat: "ADAS基础", full: "Navigate on Autopilot / Pilot", desc: "导航辅助驾驶，在高精地图覆盖区域，按导航路线自动完成变道、超车、进出匝道等操作。各品牌名称不同：特斯拉NOA、蔚来NOP、小鹏NGP、理想NOA。" },
  { term: "HMI", cat: "人机交互", full: "Human-Machine Interface", desc: "人机交互界面。自动驾驶系统与驾驶员之间的「翻译官」，通过仪表盘、中控屏、HUD抬头显示、语音等多种方式传递系统状态和接管请求。" },
  { term: "HUD", cat: "人机交互", full: "Head-Up Display", desc: "抬头显示，将关键驾驶信息投射到前挡风玻璃上，减少驾驶员视线离开道路的时间。AR-HUD可叠加导航箭头、ADAS预警等增强现实信息。" },
  { term: "ODD", cat: "安全标准", full: "Operational Design Domain", desc: "设计运行域。自动驾驶系统设计的运行条件范围，包括道路类型、地理范围、速度范围、天气条件、光照条件等。超出ODD时系统需请求接管或安全停车。" },
  { term: "RL", cat: "感知系统", full: "Reinforcement Learning", desc: "强化学习。通过与环境交互学习最优策略，可用于行为决策和轨迹规划。自动驾驶中通常结合安全约束使用，如RLHF（人类反馈强化学习）用于对齐驾驶偏好。" },

  // 安全相关
  { term: "eAES", cat: "ADAS基础", full: "enhanced Automatic Emergency Steering", desc: "增强版自动紧急转向。在紧急情况下自动转向避障，支持边刹边让，比单纯AEB增加了横向避让能力，扩展了安全防护维度。" },
  { term: "AEB", cat: "ADAS基础", full: "Automatic Emergency Braking", desc: "自动紧急制动。检测到即将发生碰撞时自动施加制动力，是L0-L2最基础也是最重要的主动安全功能之一。各国已将AEB纳入新车评价标准。" },
  { term: "VRU", cat: "ADAS基础", full: "Vulnerable Road Users", desc: "弱势道路使用者。包括行人、自行车骑行者、电动自行车、摩托车骑手等。VRU保护是自动驾驶安全设计的重中之重，需要特殊的检测和预测算法。" },
  { term: "功能安全", cat: "安全标准", full: "Functional Safety (ISO 26262)", desc: "确保电子电气系统在故障时不产生不可接受的风险。ISO 26262定义了ASIL(A-D)四个安全完整性等级，自动驾驶系统通常需达到ASIL-D最高等级。" },
  { term: "预期功能安全", cat: "安全标准", full: "SOTIF (ISO 21448)", desc: "预期功能安全。关注系统在无故障情况下因性能局限（如传感器在暴雨中性能下降、算法对罕见场景处理不足）导致的风险，是自动驾驶特有的安全维度。" },

  // 芯片相关
  { term: "ASIC", cat: "量产工程", full: "Application-Specific Integrated Circuit", desc: "专用集成电路。为特定应用定制的芯片，如特斯拉FSD芯片、地平线征程系列。相比通用芯片功耗更低、效率更高，是自动驾驶芯片的主流方向。" },
  { term: "SoC", cat: "量产工程", full: "System on Chip", desc: "片上系统。将CPU、GPU、NPU、ISP等多种功能集成在单一芯片上。代表：高通Snapdragon Ride、英伟达DRIVE Thor、地平线征程6系列。" },
  { term: "NPU", cat: "量产工程", full: "Neural Processing Unit", desc: "神经网络处理器。专门为深度学习推理优化的计算单元，是自动驾驶芯片实现高TOPS算力的核心。代表：华为昇腾系列NPU、地平线BPU架构。" },

  // 数据相关
  { term: "4D标注", cat: "数据闭环", full: "4D Annotation", desc: "在3D空间标注基础上加入时间维度(4D)，标注目标在连续时间帧中的运动轨迹。是端到端自动驾驶模型训练所需的高质量数据标注形式。" },
  { term: "自动标注", cat: "数据闭环", full: "Auto-labeling", desc: "利用已训练模型对新采集数据进行自动标注，大幅降低人工标注成本。典型流程：大模型预标注→人工校验修正→模型再训练→标注质量提升。" },
  { term: "影子模式", cat: "数据闭环", full: "Shadow Mode", desc: "车载算法在后台运行但不实际控制车辆，将决策与实际驾驶员操作对比。大规模采集算法差异数据用于训练优化，是特斯拉等企业数据闭环的核心手段。" },
  { term: "数据清洗", cat: "数据闭环", full: "Data Cleaning", desc: "对采集的原始驾驶数据进行去噪、去重、过滤低质量样本等处理的过程。高质量数据是自动驾驶算法性能的基础，数据清洗占数据闭环工作量的60%以上。" },
  { term: "回灌测试", cat: "数据闭环", full: "Data Replay / Log Replay", desc: "将实车采集的道路数据重新注入自动驾驶系统进行离线仿真测试。可大规模复现真实场景、回归验证算法修改效果，是数据闭环中的关键验证环节。" },

  // ADAS 基础功能
  { term: "ACC", cat: "ADAS基础", full: "Adaptive Cruise Control", desc: "自适应巡航控制。L1级辅助驾驶功能，自动调整车速以保持与前车的安全距离，是L2+自动驾驶的纵向控制基础。" },
  { term: "LKA", cat: "ADAS基础", full: "Lane Keeping Assist", desc: "车道保持辅助。L1级功能，通过摄像头识别车道线，自动微调方向盘使车辆保持在车道中心。与ACC组合构成L2级基础功能。" },
  { term: "AEB", cat: "ADAS基础", full: "Automatic Emergency Braking", desc: "自动紧急制动。检测到即将发生碰撞时自动施加制动力，是最重要的主动安全功能之一。各国已将AEB纳入新车评价标准(NCAP)。" },
  { term: "APA", cat: "ADAS基础", full: "Automatic Parking Assist", desc: "自动泊车辅助。通过超声波传感器和摄像头探测车位并自动完成泊车操作。从半自动(驾驶员控制挡位)演进到全自动(一键泊车)和记忆泊车(跨楼层)。" },

  // 量产相关
  { term: "域控制器", cat: "量产工程", full: "Domain Controller", desc: "按功能域(智驾域/座舱域/车身域等)划分的集中式计算平台。整合多个ECU功能，提供统一算力支撑。代表：华为MDC、德赛西威IPU、地平线Matrix。" },
  { term: "车规级", cat: "量产工程", full: "Automotive-grade", desc: "满足汽车行业严格可靠性标准的元器件等级。需通过AEC-Q100(芯片)、ISO 16750(环境)、ISO 7637(电磁兼容)等认证，工作温度范围-40~125°C，失效率<1PPM。" },
  { term: "冗余设计", cat: "量产工程", full: "Redundancy Design", desc: "关键系统设置备份以保证单点故障时仍能安全运行。自动驾驶六大冗余：感知冗余、计算冗余、执行冗余、通信冗余、电源冗余、制动冗余。是L3+系统的安全基石。" },
  { term: "Robotaxi", cat: "商业应用", full: "Robotaxi (Autonomous Taxi)", desc: "自动驾驶出租车。L4级自动驾驶在出行领域的主要商业应用，在限定区域内提供无人驾驶出行服务。代表：百度Apollo萝卜快跑、Waymo One、小马智行PonyPilot。" },
  { term: "FOTA", cat: "量产工程", full: "Firmware Over-The-Air", desc: "固件远程升级。针对车辆底层固件(如BMS、VCU、智驾域控固件)的远程更新，可涉及车辆行驶安全相关系统，升级过程需满足功能安全要求。" },
  { term: "SOTA", cat: "量产工程", full: "Software Over-The-Air", desc: "软件远程升级。针对车载应用软件(如地图、语音助手、娱乐系统)的远程更新，不涉及车辆行驶安全系统，升级风险和门槛低于FOTA。" },
  { term: "白名单/灰名单", cat: "量产工程", full: "Whitelist / Greylist", desc: "自动驾驶ODD管理机制。白名单为已验证可安全使用自动驾驶功能的路段；灰名单为部分条件(天气/时段)下可行的路段；黑名单为禁止使用路段。是L3+量产车的安全管理基础。" },

  // 评测相关
  { term: "评测基准", cat: "评测体系", full: "Benchmark", desc: "衡量自动驾驶系统性能的标准化测试体系。包含公开数据集评测(NuScenes、Waymo Open Dataset)、封闭场地测试(NCAP场景)和开放道路评测(MPI/MCP)。" },
  { term: "横向控制", cat: "规划控制", full: "Lateral Control", desc: "车辆横向运动(转向)的精确控制，包括车道保持、换道、避障等场景下的方向盘转角控制。评价指标：中心线偏差、转向平滑度、超调量。" },
  { term: "纵向控制", cat: "规划控制", full: "Longitudinal Control", desc: "车辆纵向运动(加速/制动)的精确控制，包括跟车巡航、启停、紧急制动等场景。评价指标：跟车时距误差、加速度波动、制动舒适度。" },

  // 坐标系与标定
  { term: "坐标系", cat: "传感器与标定", full: "Coordinate Systems", desc: "自动驾驶涉及多种坐标系：世界坐标系(WGS84/GPS)、车辆坐标系(ISO 8855，以车中心为原点)、传感器坐标系(各摄像头/LiDAR/雷达相对安装位置)。坐标系转换是感知融合的基础。" },
  { term: "内外参标定", cat: "传感器与标定", full: "Intrinsic / Extrinsic Calibration", desc: "内参标定确定传感器自身光学/物理参数(焦距、畸变、畸变中心)；外参标定确定多传感器之间的相对位姿关系(平移+旋转)。标定精度直接影响感知融合效果和测距精度。" },
  { term: "时间同步", cat: "传感器与标定", full: "Time Synchronization", desc: "确保多传感器(GNSS/IMU/摄像头/LiDAR)数据时间戳对齐的技术。通常采用PTP或gPTP协议，同步精度需达到微秒级。时间不同步会导致运动目标位置偏移，是感知融合的前提条件。" },

  // 常见行为问题
  { term: "偏航", cat: "常见问题", full: "Lane Departure / Yaw Deviation", desc: "车辆行驶轨迹偏离车道中心线。可能原因：定位误差、感知车道线丢失、控制参数失配或横风干扰。严重时导致压线或驶出车道，是LKA/AEB的重要触发条件。" },
  { term: "限速响应", cat: "规划控制", full: "Speed Limit Response", desc: "自动驾驶系统对道路限速标识的识别和响应能力。包含限速牌识别(TSR)、地图限速数据融合、弯道/匝道限速预判。要求平滑减速而非急刹，过早减速或过晚响应均影响评价。" },
  { term: "过度避让", cat: "常见问题", full: "Over-cautious Avoidance / Overly Conservative", desc: "系统对潜在风险反应过度保守，不必要的减速或绕行。虽保障了安全性，但牺牲了通行效率和驾乘体验，是L4系统'过度安全'的典型工程取舍问题。" },
  { term: "变道决策", cat: "规划控制", full: "Lane Change Decision", desc: "自动驾驶系统判断是否、何时、如何变道的决策过程。需综合评估目标车道空间、后车速度、可接受间隙、变道收益(更快/更优路线)。决策犹豫或激进均会导致接管。" },
  { term: "压线", cat: "常见问题", full: "Lane Encroachment / Line Crossing", desc: "车辆轮胎或车身越过车道边界线。原因：定位偏差、感知车道线丢失、规划轨迹过切、控制超调。高频压线严重影响安全评价和用户安心感。" },
  { term: "选道犹豫", cat: "常见问题", full: "Lane Selection Indecision", desc: "系统在多车道场景下无法快速确定最优车道，表现为左右反复评估、长时间不决策。导致通行效率下降、后车催促进而触发效率接管。" },

  // 人机交互与评价
  { term: "人机共驾", cat: "人机交互", full: "Human-Machine Co-driving", desc: "驾驶员与自动驾驶系统共享车辆控制权的驾驶模式。L2-L3阶段的典型形态，核心挑战在于接管时序、权限切换和驾驶员状态监测，目标是实现安全顺畅的人机协作。" },
  { term: "评价四维度", cat: "人机交互", full: "Safety / Efficiency / Trust / Comfort", desc: "自动驾驶系统评价的四大维度：安全性(无事故/少接管)、效率(通行时间/速度)、安心感(用户对系统的信任程度)、舒适感(加减速平顺/转向柔和)。四者需要平衡，不可偏废。" },
  { term: "触发机制", cat: "人机交互", full: "Trigger / Activation Mechanism", desc: "自动驾驶功能的激活条件和触发方式。包括ODD满足确认、驾驶员一键激活、系统自检通过等。触发机制需清晰、可信、防误触，是HMI设计的关键要素。" },
  { term: "接管分级", cat: "人机交互", full: "Intervention Classification", desc: "对接管事件按原因的系统分类。安全接管(系统未识别风险/违反交规)、效率接管(策略不当/选道不佳)、体验接管(过度保守/不舒适)。分级统计驱动针对性算法优化。" },

  // 开发工具链
  { term: "Foxglove", cat: "开发工具", full: "Foxglove Studio", desc: "现代机器人数据可视化与调试平台，支持MCAP/ROS Bag等格式的数据回放。提供Web端面板布局、3D场景渲染、时序图表、消息检查器等功能，是自动驾驶数据分析的主流工具。" },
  { term: "评测数据集", cat: "评测体系", full: "Benchmark Dataset Construction", desc: "构建标准化评测数据集的流程：多源数据筛选清洗→标注分类→场景标准化固化→绑定量化指标→持续扩充。高质量评测数据集是客观衡量自动驾驶性能的标尺。" },
  { term: "内场测试", cat: "数据闭环", full: "Indoor / Lab Testing (SIL/HIL)", desc: "在实验室可控环境中进行的测试。SIL(软件在环)纯软件仿真，HIL(硬件在环)接入真实硬件。优势是可复现、成本低、可大规模回归；局限是无法覆盖真实世界的复杂性。" },
  { term: "外场测试", cat: "数据闭环", full: "On-road / Field Testing", desc: "在真实公共道路上进行的实车路测。采集真实道路数据、验证系统在复杂动态环境中的表现。外场数据是数据闭环的起点，也是内场评测场景的主要来源。" },

  // 行业标准
  { term: "ISO 26262", cat: "行业标准", full: "ISO 26262 — Functional Safety", desc: "道路车辆功能安全国际标准。定义ASIL(A-D)四个安全完整性等级，规范从概念到报废全生命周期的功能安全管理。自动驾驶系统核心控制器通常需达到ASIL-D最高等级。" },
  { term: "ISO 21448", cat: "行业标准", full: "ISO 21448 — SOTIF", desc: "预期功能安全标准。关注系统在无硬件故障情况下因性能局限(传感器在恶劣天气下降、AI算法误判罕见场景)导致的潜在风险。是AI驱动的自动驾驶系统特有的安全标准。" },
  { term: "UN R157", cat: "行业标准", full: "UN Regulation No.157 — ALKS", desc: "联合国自动车道保持系统法规。全球首个L3级自动驾驶国际法规，规定60km/h以下高速公路ALKS的技术要求、测试方法和审核准则，于2021年生效。" },
  { term: "GB/T 40429", cat: "行业标准", full: "GB/T 40429-2021", desc: "中国自动驾驶数据记录系统国家标准。规范L3+自动驾驶汽车的DSSAD(数据存储系统)技术要求，包括碰撞前数据记录范围、存储时长、数据提取接口等，为事故责任判定提供依据。" }
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

export const mockKnowledgeData = {
  cases: [
    {
      id: "KC-0908-001",
      title: "偏航电机过载后检查限位传感器",
      faultCode: "E-0908",
      component: "偏航系统",
      turbineModel: "WT-5.0",
      resolution: "复位偏航驱动，检查限位传感器接线并更换异常件。",
      successRate: 0.86,
    },
    {
      id: "KC-0908-002",
      title: "偏航刹车间隙异常导致过载",
      faultCode: "E-0908",
      component: "偏航系统",
      turbineModel: "WT-5.0",
      resolution: "检查偏航刹车间隙和摩擦片磨损，完成复机验证。",
      successRate: 0.78,
    },
    {
      id: "KC-2401-001",
      title: "变桨通信模块接线松动",
      faultCode: "E-2401",
      component: "变桨系统",
      turbineModel: "WT-4.2",
      resolution: "检查通信模块接线，替换异常端子。",
      successRate: 0.82,
    },
  ],
  sops: [
    {
      id: "SOP-YAW-001",
      title: "偏航系统登塔检查 SOP",
      component: "偏航系统",
      turbineModel: "WT-5.0",
      steps: ["确认机组停机闭锁", "检查偏航驱动与限位传感器", "执行复位和低速偏航测试"],
    },
    {
      id: "SOP-PITCH-001",
      title: "变桨通信异常检查 SOP",
      component: "变桨系统",
      turbineModel: "WT-4.2",
      steps: ["检查通信模块", "确认供电", "复位后观察告警"],
    },
  ],
};

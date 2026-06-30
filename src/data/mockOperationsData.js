export const mockOperationsData = {
  group: {
    id: "group-all",
    name: "集团全部",
  },
  regions: [
    {
      id: "region-north",
      name: "北方大区",
      projects: [
        {
          id: "project-bay",
          name: "湾北项目",
          windFarms: [
            {
              id: "farm-yunling",
              name: "云岭风场",
              metrics: {
                totalTurbines: 6,
                runningTurbines: 4,
                stoppedTurbines: 2,
                availabilityRate: 91.8,
                downtimeLossMwh: 168.4,
                openWorkOrders: 3,
                overdueWorkOrders: 1,
                sparePartCost: 96000,
              },
            },
            {
              id: "farm-hexi",
              name: "河西风场",
              metrics: {
                totalTurbines: 4,
                runningTurbines: 3,
                stoppedTurbines: 1,
                availabilityRate: 93.1,
                downtimeLossMwh: 122.6,
                openWorkOrders: 2,
                overdueWorkOrders: 1,
                sparePartCost: 85000,
              },
            },
          ],
        },
      ],
    },
    {
      id: "region-east",
      name: "华东大区",
      projects: [
        {
          id: "project-coast",
          name: "沿海项目",
          windFarms: [
            {
              id: "farm-donghai",
              name: "东海风场",
              metrics: {
                totalTurbines: 5,
                runningTurbines: 4,
                stoppedTurbines: 1,
                availabilityRate: 92.9,
                downtimeLossMwh: 84.8,
                openWorkOrders: 2,
                overdueWorkOrders: 1,
                sparePartCost: 62000,
              },
            },
          ],
        },
        {
          id: "project-ridge",
          name: "山脊项目",
          windFarms: [
            {
              id: "farm-hailing",
              name: "海岭风场",
              metrics: {
                totalTurbines: 3,
                runningTurbines: 2,
                stoppedTurbines: 1,
                availabilityRate: 91.7,
                downtimeLossMwh: 42.8,
                openWorkOrders: 1,
                overdueWorkOrders: 0,
                sparePartCost: 43000,
              },
            },
          ],
        },
      ],
    },
  ],
  highFrequencyFaults: [
    { code: "E-2401", name: "变桨通信异常", count: 18, component: "变桨系统" },
    { code: "E-1703", name: "齿轮箱油温高", count: 11, component: "齿轮箱" },
    { code: "E-0908", name: "偏航电机过载", count: 9, component: "偏航系统" },
  ],
  problemTurbines: [
    { id: "YL-03", windFarm: "云岭风场", openIssues: 4, downtimeHours: 36.5 },
    { id: "HX-02", windFarm: "河西风场", openIssues: 3, downtimeHours: 24.2 },
    { id: "DH-05", windFarm: "东海风场", openIssues: 2, downtimeHours: 18.7 },
  ],
  urgentWorkOrders: [
    { id: "WO-20260623-014", title: "云岭风场 YL-03 变桨通信异常", status: "待登塔", overdueHours: 6 },
    { id: "WO-20260623-011", title: "河西风场 HX-02 齿轮箱油温高", status: "待复机验证", overdueHours: 3 },
    { id: "WO-20260622-029", title: "东海风场 DH-05 偏航电机过载", status: "已派发", overdueHours: 2 },
  ],
};

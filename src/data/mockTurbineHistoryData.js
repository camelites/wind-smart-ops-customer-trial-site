export const mockTurbineHistoryData = {
  turbines: [
    {
      id: "DH-05",
      windFarmName: "东海风场",
      model: "WT-5.0",
      capacityMw: 5,
      commissionedAt: "2024-10-18",
      warrantyUntil: "2029-10-17",
      availabilityRate: 92.9,
    },
    {
      id: "YL-03",
      windFarmName: "云岭风场",
      model: "WT-4.2",
      capacityMw: 4.2,
      commissionedAt: "2023-06-12",
      warrantyUntil: "2028-06-11",
      availabilityRate: 91.8,
    },
  ],
  faults: [
    {
      id: "FE-20260623-003",
      turbineId: "DH-05",
      code: "E-0908",
      name: "偏航电机过载",
      occurredAt: "2026-06-23T10:30:00+08:00",
      status: "已生成工单",
    },
  ],
  workOrders: [
    {
      id: "WO-20260623-003",
      turbineId: "DH-05",
      faultCode: "E-0908",
      title: "DH-05 偏航电机过载",
      status: "待复机验证",
      updatedAt: "2026-06-23T15:10:00+08:00",
    },
  ],
  climbTasks: [
    {
      id: "CT-20260623-003",
      turbineId: "DH-05",
      workOrderId: "WO-20260623-003",
      title: "DH-05 偏航电机过载登塔记录",
      status: "已提交",
      updatedAt: "2026-06-23T15:10:00+08:00",
    },
  ],
  sparePartUsages: [
    {
      id: "SPU-WO-20260623-003-SP-YAW-LIMIT-01",
      turbineId: "DH-05",
      workOrderId: "WO-20260623-003",
      faultCode: "E-0908",
      name: "偏航限位传感器",
      totalCost: 4200,
      registeredAt: "2026-06-23T16:00:00+08:00",
    },
  ],
  issues: [
    {
      id: "ISSUE-20260623-009",
      turbineId: "DH-05",
      title: "偏航电机过载复发风险观察",
      status: "处理中",
      owner: "周工",
      dueAt: "2026-06-25",
    },
  ],
};

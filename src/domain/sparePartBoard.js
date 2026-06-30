const defectiveStatuses = ["待质检", "返厂", "维修", "报废", "已闭环"];

export function buildSparePartBoard(data) {
  return {
    totalUsageCost: data.usages.reduce((sum, usage) => sum + usage.totalCost, 0),
    boundUsageCount: data.usages.filter(hasRequiredBinding).length,
    defectiveOpenCount: data.defectiveParts.filter((part) => part.status !== "已闭环").length,
    defectiveStatusCounts: defectiveStatuses
      .map((status) => ({
        status,
        count: data.defectiveParts.filter((part) => part.status === status).length,
      }))
      .filter((item) => item.count > 0),
    recentUsages: data.usages,
    defectiveParts: data.defectiveParts,
  };
}

export function findWorkOrderSparePartRecords(data, workOrderId) {
  return {
    usages: data.usages.filter((usage) => usage.workOrderId === workOrderId),
    defectiveParts: data.defectiveParts.filter((part) => part.workOrderId === workOrderId),
  };
}

function hasRequiredBinding(usage) {
  return Boolean(usage.workOrderId && usage.turbineId && usage.faultCode);
}

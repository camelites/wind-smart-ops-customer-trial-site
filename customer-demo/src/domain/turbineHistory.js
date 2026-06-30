export function buildTurbineHistory(data, turbineId) {
  const turbine = data.turbines.find((item) => item.id === turbineId);
  if (!turbine) {
    throw new Error(`Turbine not found: ${turbineId}`);
  }

  const faults = data.faults.filter((item) => item.turbineId === turbineId);
  const workOrders = data.workOrders.filter((item) => item.turbineId === turbineId);
  const climbTasks = data.climbTasks.filter((item) => item.turbineId === turbineId);
  const sparePartUsages = data.sparePartUsages.filter((item) => item.turbineId === turbineId);
  const issues = data.issues.filter((item) => item.turbineId === turbineId);

  const timeline = [
    ...faults.map((item) => ({
      id: item.id,
      type: "fault",
      title: `${item.code} · ${item.name}`,
      status: item.status,
      at: item.occurredAt,
    })),
    ...workOrders.map((item) => ({
      id: item.id,
      type: "workOrder",
      title: item.title,
      status: item.status,
      at: item.updatedAt,
    })),
    ...climbTasks.map((item) => ({
      id: item.id,
      type: "climbTask",
      title: item.title,
      status: item.status,
      at: item.updatedAt,
    })),
    ...sparePartUsages.map((item) => ({
      id: item.id,
      type: "sparePart",
      title: item.name,
      status: `${item.faultCode} · ${formatCurrency(item.totalCost)}`,
      at: item.registeredAt,
    })),
    ...issues.map((item) => ({
      id: item.id,
      type: "issue",
      title: item.title,
      status: `${item.status} · ${item.owner}`,
      at: item.dueAt,
    })),
  ].sort((left, right) => new Date(left.at).getTime() - new Date(right.at).getTime());

  return {
    turbine,
    summary: {
      faultCount: faults.length,
      workOrderCount: workOrders.length,
      openIssues: issues.filter((item) => item.status !== "已关闭").length,
      totalSparePartCost: sparePartUsages.reduce((sum, item) => sum + item.totalCost, 0),
    },
    timeline,
  };
}

export function filterTurbineTimeline(timeline, type) {
  if (type === "all") return timeline;
  return timeline.filter((item) => item.type === type);
}

function formatCurrency(value) {
  if (value < 10000) return `¥${value.toLocaleString("zh-CN")}`;
  const tenThousand = Math.round((value / 10000) * 10) / 10;
  return `¥${tenThousand.toLocaleString("zh-CN")}万`;
}

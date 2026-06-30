const boardStatuses = ["待派发", "已派发", "待登塔", "待复机验证"];

const nextActionByStatus = {
  待派发: ["已派发", "已取消"],
  已派发: ["待登塔", "已挂起"],
  待登塔: ["作业中", "已挂起"],
  作业中: ["待复机验证", "已挂起"],
  待复机验证: ["待验收", "已退回"],
  待验收: ["已关闭", "已退回"],
};

export function buildWorkOrderBoard(data) {
  return {
    total: data.workOrders.length,
    overdue: data.workOrders.filter((workOrder) => workOrder.overdue).length,
    waitingDispatch: countByStatus(data.workOrders, "待派发"),
    waitingClimb: countByStatus(data.workOrders, "待登塔"),
    statusColumns: boardStatuses.map((status) => ({
      status,
      items: data.workOrders.filter((workOrder) => workOrder.status === status),
    })),
  };
}

export function findWorkOrderDetail(data, workOrderId) {
  const workOrder = data.workOrders.find((item) => item.id === workOrderId);
  if (!workOrder) {
    throw new Error(`Work order not found: ${workOrderId}`);
  }

  return {
    workOrder,
    faultEvent: data.faultEvents.find((item) => item.id === workOrder.faultEventId) ?? null,
    auditLogs: data.auditLogs.filter((item) => item.entityId === workOrder.id),
    nextActions: nextActionByStatus[workOrder.status] ?? [],
  };
}

function countByStatus(workOrders, status) {
  return workOrders.filter((workOrder) => workOrder.status === status).length;
}

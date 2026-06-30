const dispatchPath = {
  待派发: ["已派发", "已取消"],
  已派发: ["待登塔", "已挂起", "已取消"],
  待登塔: ["作业中", "已挂起", "已取消"],
  作业中: ["待复机验证", "已挂起"],
  待复机验证: ["待验收", "已退回"],
  待验收: ["已关闭", "已退回"],
  已挂起: ["已派发", "待登塔", "已取消"],
  已退回: ["已派发", "待登塔"],
  已取消: [],
  已关闭: [],
};

export function createWorkOrderFromFault(faultEvent, context) {
  if (faultEvent.status !== "已确认") {
    throw new Error("Fault event must be confirmed before creating a work order.");
  }

  const workOrder = {
    id: `WO-${faultEvent.id.replace(/^FE-/, "")}`,
    faultEventId: faultEvent.id,
    faultCode: faultEvent.code,
    title: `${faultEvent.turbineId} ${faultEvent.name}`,
    turbineId: faultEvent.turbineId,
    windFarmId: faultEvent.windFarmId,
    severity: faultEvent.severity,
    status: "待派发",
    createdAt: context.at,
    updatedAt: context.at,
  };

  return {
    workOrder,
    auditLogs: [
      buildAuditLog({
        workOrder,
        action: "createFromFault",
        context,
        from: null,
        to: workOrder.status,
      }),
    ],
  };
}

export function transitionWorkOrder(workOrder, nextStatus, context) {
  const allowedStatuses = dispatchPath[workOrder.status] ?? [];
  if (!allowedStatuses.includes(nextStatus)) {
    throw new Error(`Illegal work order transition: ${workOrder.status} -> ${nextStatus}`);
  }

  const updatedWorkOrder = {
    ...workOrder,
    status: nextStatus,
    updatedAt: context.at,
  };

  return {
    workOrder: updatedWorkOrder,
    auditLog: buildAuditLog({
      workOrder,
      action: "transition",
      context,
      from: workOrder.status,
      to: nextStatus,
    }),
  };
}

function buildAuditLog({ workOrder, action, context, from, to }) {
  return {
    entityType: "WorkOrder",
    entityId: workOrder.id,
    action,
    operatorId: context.operatorId,
    at: context.at,
    from,
    to,
  };
}

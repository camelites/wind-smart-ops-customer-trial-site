const requiredSafetyItems = ["weatherOk", "ppeReady", "permitApproved", "towerLockedOut"];

export function createClimbTaskFromWorkOrder(workOrder, context) {
  if (workOrder.status !== "待登塔") {
    throw new Error("Work order must be waiting for climb before creating a climb task.");
  }

  return {
    id: `CT-${workOrder.id.replace(/^WO-/, "")}`,
    workOrderId: workOrder.id,
    title: workOrder.title,
    turbineId: workOrder.turbineId,
    windFarmName: workOrder.windFarmName,
    faultCode: workOrder.faultCode,
    assignee: workOrder.assignee,
    status: "待安全确认",
    safetyConfirmed: false,
    safetyChecklist: {},
    sparePartUsages: [],
    mediaCount: 0,
    createdAt: context.at,
    updatedAt: context.at,
  };
}

export function confirmSafetyChecklist(task, context) {
  const incompleteItems = requiredSafetyItems.filter((item) => context.checkedItems[item] !== true);
  if (incompleteItems.length > 0) {
    throw new Error(`Safety checklist is incomplete: ${incompleteItems.join(", ")}`);
  }

  const confirmedTask = {
    ...task,
    status: "作业中",
    safetyConfirmed: true,
    safetyChecklist: { ...context.checkedItems },
    updatedAt: context.at,
  };

  return {
    task: confirmedTask,
    auditLog: buildAuditLog({
      task,
      action: "confirmSafety",
      context,
      from: task.status,
      to: confirmedTask.status,
    }),
  };
}

export function submitClimbTask(task, context) {
  if (!task.safetyConfirmed) {
    throw new Error("Safety must be confirmed before submitting a climb task.");
  }

  if (!context.workSummary || !context.signature) {
    throw new Error("Work summary and signature are required before submitting a climb task.");
  }

  const submittedTask = {
    ...task,
    status: "已提交",
    workSummary: context.workSummary,
    mediaCount: context.mediaCount ?? 0,
    signature: context.signature,
    sparePartUsages: context.sparePartUsages ?? [],
    updatedAt: context.at,
  };

  return {
    task: submittedTask,
    workOrderStatus: "待复机验证",
    auditLog: buildAuditLog({
      task,
      action: "submitClimbTask",
      context,
      from: task.status,
      to: submittedTask.status,
    }),
  };
}

function buildAuditLog({ task, action, context, from, to }) {
  return {
    entityType: "ClimbTask",
    entityId: task.id,
    action,
    operatorId: context.operatorId,
    at: context.at,
    from,
    to,
  };
}

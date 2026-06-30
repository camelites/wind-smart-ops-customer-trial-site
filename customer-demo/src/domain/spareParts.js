const defectivePartTransitions = {
  故障件已回收: ["待质检"],
  待质检: ["返厂", "维修", "报废"],
  返厂: ["已闭环"],
  维修: ["已闭环"],
  报废: ["已闭环"],
  已闭环: [],
};

export function registerSparePartUsage(input, context) {
  requireBinding(input);

  const usage = {
    id: `SPU-${input.workOrderId}-${input.partId}`,
    workOrderId: input.workOrderId,
    turbineId: input.turbineId,
    faultCode: input.faultCode,
    partId: input.partId,
    name: input.name,
    quantity: input.quantity,
    unitCost: input.unitCost,
    totalCost: input.quantity * input.unitCost,
    registeredAt: context.at,
  };

  return {
    usage,
    auditLog: buildAuditLog({
      entityType: "SparePartUsage",
      entityId: usage.id,
      action: "registerSparePartUsage",
      context,
      from: null,
      to: "已消耗",
    }),
  };
}

export function registerDefectivePart(input, context) {
  requireBinding(input);

  const part = {
    id: `DP-${input.usageId}`,
    usageId: input.usageId,
    workOrderId: input.workOrderId,
    turbineId: input.turbineId,
    faultCode: input.faultCode,
    partId: input.partId,
    name: input.name,
    status: "故障件已回收",
    registeredAt: context.at,
    updatedAt: context.at,
  };

  return {
    part,
    auditLog: buildAuditLog({
      entityType: "DefectivePart",
      entityId: part.id,
      action: "registerDefectivePart",
      context,
      from: null,
      to: part.status,
    }),
  };
}

export function transitionDefectivePart(part, nextStatus, context) {
  const allowed = defectivePartTransitions[part.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw new Error(`Illegal defective part transition: ${part.status} -> ${nextStatus}`);
  }

  const updatedPart = {
    ...part,
    status: nextStatus,
    updatedAt: context.at,
  };

  return {
    part: updatedPart,
    auditLog: buildAuditLog({
      entityType: "DefectivePart",
      entityId: part.id,
      action: "transitionDefectivePart",
      context,
      from: part.status,
      to: nextStatus,
    }),
  };
}

function requireBinding(input) {
  if (!input.workOrderId || !input.turbineId || !input.faultCode) {
    throw new Error("workOrderId, turbineId and faultCode are required for spare part binding.");
  }
}

function buildAuditLog({ entityType, entityId, action, context, from, to }) {
  return {
    entityType,
    entityId,
    action,
    operatorId: context.operatorId,
    at: context.at,
    from,
    to,
  };
}

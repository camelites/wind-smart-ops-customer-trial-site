export function buildKnowledgeSuggestion(data, faultContext) {
  const matchedCases = data.cases.filter((item) =>
    item.faultCode === faultContext.faultCode ||
    (item.component === faultContext.component && item.turbineModel === faultContext.turbineModel),
  );
  const sops = data.sops.filter((item) =>
    item.component === faultContext.component && item.turbineModel === faultContext.turbineModel,
  );

  return {
    id: `KS-${faultContext.faultCode}-${faultContext.turbineModel}`,
    title:
      matchedCases[0]?.title.replace(/后.+$/, "处理建议") ??
      `${faultContext.faultCode} 辅助建议`,
    matchedCases,
    sops,
    evidenceFields: ["faultCode", "component", "turbineModel"],
    disclaimer: "仅供人工判断，不能自动关闭工单或生成维修结论。",
    canAutoCloseWorkOrder: false,
    canGenerateRepairConclusion: false,
  };
}

export function recordSuggestionDecision(suggestion, context) {
  return {
    suggestionId: suggestion.id,
    decision: context.decision,
    operatorId: context.operatorId,
    at: context.at,
    workOrderStatusChange: null,
    auditLog: {
      entityType: "KnowledgeSuggestion",
      entityId: suggestion.id,
      action: "recordKnowledgeSuggestionDecision",
      operatorId: context.operatorId,
      at: context.at,
      from: "pending",
      to: context.decision,
    },
  };
}

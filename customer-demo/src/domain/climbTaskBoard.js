const safetyItems = [
  { key: "weatherOk", label: "天气与风速满足登塔条件" },
  { key: "ppeReady", label: "安全帽、安全带、防坠器等 PPE 已确认" },
  { key: "permitApproved", label: "登塔作业票已审批" },
  { key: "towerLockedOut", label: "机组停机闭锁与挂牌完成" },
];

export function buildMobileTaskList(data, assigneeId) {
  return data.tasks
    .filter((task) => task.assigneeId === assigneeId)
    .map((task) => ({
      id: task.id,
      workOrderId: task.workOrderId,
      title: task.title,
      turbineId: task.turbineId,
      windFarmName: task.windFarmName,
      status: task.status,
      plannedAt: task.plannedAt,
    }));
}

export function findClimbTaskDetail(data, taskId) {
  const task = data.tasks.find((item) => item.id === taskId);
  if (!task) {
    throw new Error(`Climb task not found: ${taskId}`);
  }

  return {
    task,
    safetyItems,
    canSubmit: task.safetyConfirmed && task.status === "作业中",
    requiredSubmitFields: ["workSummary", "signature"],
  };
}

import { mockOperationsData } from "./data/mockOperationsData.js";
import { mockClimbTaskData } from "./data/mockClimbTaskData.js";
import { mockKnowledgeData } from "./data/mockKnowledgeData.js";
import { mockSparePartData } from "./data/mockSparePartData.js";
import { mockTurbineHistoryData } from "./data/mockTurbineHistoryData.js";
import { mockWorkOrderData } from "./data/mockWorkOrderData.js";
import { confirmSafetyChecklist, submitClimbTask } from "./domain/climbTasks.js";
import { buildMobileTaskList, findClimbTaskDetail } from "./domain/climbTaskBoard.js";
import { buildDashboardSummary, filterScopeOptions } from "./domain/dashboard.js";
import { buildKnowledgeSuggestion, recordSuggestionDecision } from "./domain/knowledgeAdvisor.js";
import { buildSparePartBoard } from "./domain/sparePartBoard.js";
import { buildTurbineHistory, filterTurbineTimeline } from "./domain/turbineHistory.js";
import { buildWorkOrderBoard, findWorkOrderDetail } from "./domain/workOrderBoard.js";
import {
  applyPhase3PilotEntryGuard,
  applyPhase3PilotLockdown,
  bindPhase3PilotHashGuard,
} from "./phase3/pilotEntryGuard.js";
import { bindPhase3PilotConsole } from "./phase3/pilotConsole.js?v=20260630-customer-demo-2";

applyPhase3PilotEntryGuard();
applyPhase3PilotLockdown();
bindPhase3PilotHashGuard();

const scopeSelect = document.querySelector("#scopeSelect");
const scopeLabel = document.querySelector("#scopeLabel");

const metricTargets = {
  availabilityRate: document.querySelector("#availabilityRate"),
  runningTurbines: document.querySelector("#runningTurbines"),
  stoppedTurbines: document.querySelector("#stoppedTurbines"),
  downtimeLoss: document.querySelector("#downtimeLoss"),
  openWorkOrders: document.querySelector("#openWorkOrders"),
  overdueWorkOrders: document.querySelector("#overdueWorkOrders"),
  sparePartCost: document.querySelector("#sparePartCost"),
  donutRate: document.querySelector("#donutRate"),
  runningCount: document.querySelector("#runningCount"),
  stoppedCount: document.querySelector("#stoppedCount"),
  runningBar: document.querySelector("#runningBar"),
  stoppedBar: document.querySelector("#stoppedBar"),
  urgentWorkOrders: document.querySelector("#urgentWorkOrders"),
  faultList: document.querySelector("#faultList"),
  problemTurbines: document.querySelector("#problemTurbines"),
  workOrderTotal: document.querySelector("#workOrderTotal"),
  workOrderOverdue: document.querySelector("#workOrderOverdue"),
  waitingDispatch: document.querySelector("#waitingDispatch"),
  waitingClimb: document.querySelector("#waitingClimb"),
  workOrderColumns: document.querySelector("#workOrderColumns"),
  workOrderDetail: document.querySelector("#workOrderDetail"),
  workOrderDetailStatus: document.querySelector("#workOrderDetailStatus"),
  mobileTaskCount: document.querySelector("#mobileTaskCount"),
  mobileTaskList: document.querySelector("#mobileTaskList"),
  climbTaskTitle: document.querySelector("#climbTaskTitle"),
  climbTaskStatus: document.querySelector("#climbTaskStatus"),
  climbTaskMeta: document.querySelector("#climbTaskMeta"),
  safetyChecklist: document.querySelector("#safetyChecklist"),
  submitClimbTask: document.querySelector("#submitClimbTask"),
  submitHint: document.querySelector("#submitHint"),
  workSummaryInput: document.querySelector("#workSummaryInput"),
  signatureInput: document.querySelector("#signatureInput"),
  spareBoundCount: document.querySelector("#spareBoundCount"),
  spareTotalCost: document.querySelector("#spareTotalCost"),
  defectiveOpenCount: document.querySelector("#defectiveOpenCount"),
  defectiveStatusList: document.querySelector("#defectiveStatusList"),
  spareUsageTable: document.querySelector("#spareUsageTable"),
  defectivePartList: document.querySelector("#defectivePartList"),
  timelineTypeSelect: document.querySelector("#timelineTypeSelect"),
  historyTurbineId: document.querySelector("#historyTurbineId"),
  historyWindFarm: document.querySelector("#historyWindFarm"),
  historyMeta: document.querySelector("#historyMeta"),
  historyFaultCount: document.querySelector("#historyFaultCount"),
  historyWorkOrderCount: document.querySelector("#historyWorkOrderCount"),
  historySpareCost: document.querySelector("#historySpareCost"),
  historyOpenIssues: document.querySelector("#historyOpenIssues"),
  historyTimelineCount: document.querySelector("#historyTimelineCount"),
  historyTimeline: document.querySelector("#historyTimeline"),
  suggestionTitle: document.querySelector("#suggestionTitle"),
  suggestionEvidence: document.querySelector("#suggestionEvidence"),
  suggestionDisclaimer: document.querySelector("#suggestionDisclaimer"),
  adoptSuggestion: document.querySelector("#adoptSuggestion"),
  ignoreSuggestion: document.querySelector("#ignoreSuggestion"),
  suggestionDecisionHint: document.querySelector("#suggestionDecisionHint"),
  aiBoundaryList: document.querySelector("#aiBoundaryList"),
  caseCount: document.querySelector("#caseCount"),
  knowledgeCaseList: document.querySelector("#knowledgeCaseList"),
  sopCount: document.querySelector("#sopCount"),
  sopList: document.querySelector("#sopList"),
};

const scopeOptions = filterScopeOptions(mockOperationsData);
let activeClimbTask = null;
let activeWorkOrderData = mockWorkOrderData;

for (const option of scopeOptions) {
  const item = document.createElement("option");
  item.value = `${option.level}:${option.id}`;
  item.textContent = option.label;
  scopeSelect.append(item);
}

scopeSelect.addEventListener("change", () => {
  renderDashboard(parseScope(scopeSelect.value));
});

renderDashboard({ level: "group", id: "group-all" });
renderWorkOrderBoard();
renderMobileClimbCenter();
renderSparePartCenter();
renderTurbineHistory("DH-05", "all");
renderKnowledgeAssistant();
bindPhase3PilotConsole();
initPhase3MobileSmokeCsvHelper();
initPhase3BackupRestoreCsvHelper();

function renderDashboard(scope) {
  const selectedOption = scopeOptions.find(
    (option) => option.level === scope.level && option.id === scope.id,
  );
  const summary = buildDashboardSummary(mockOperationsData, scope);

  scopeLabel.textContent = selectedOption?.label ?? "集团全部";
  metricTargets.availabilityRate.textContent = `${summary.availabilityRate}%`;
  metricTargets.runningTurbines.textContent = `${summary.runningTurbines} / ${summary.totalTurbines}`;
  metricTargets.stoppedTurbines.textContent = `停机 ${summary.stoppedTurbines} 台`;
  metricTargets.downtimeLoss.textContent = summary.downtimeLossMwh.toLocaleString("zh-CN");
  metricTargets.openWorkOrders.textContent = `${summary.openWorkOrders} 单`;
  metricTargets.overdueWorkOrders.textContent = `超期 ${summary.overdueWorkOrders} 单`;
  metricTargets.sparePartCost.textContent = formatCurrency(summary.sparePartCost);
  metricTargets.donutRate.textContent = `${summary.availabilityRate}%`;
  metricTargets.runningCount.textContent = `${summary.runningTurbines} 台`;
  metricTargets.stoppedCount.textContent = `${summary.stoppedTurbines} 台`;

  const runningWidth = percent(summary.runningTurbines, summary.totalTurbines);
  const stoppedWidth = percent(summary.stoppedTurbines, summary.totalTurbines);
  metricTargets.runningBar.style.width = `${runningWidth}%`;
  metricTargets.stoppedBar.style.width = `${stoppedWidth}%`;

  renderUrgentWorkOrders(summary.urgentWorkOrders);
  renderFaults(summary.highFrequencyFaults);
  renderProblemTurbines(summary.problemTurbines);
}

function renderUrgentWorkOrders(workOrders) {
  metricTargets.urgentWorkOrders.replaceChildren(
    ...workOrders.map((workOrder) => {
      const item = document.createElement("div");
      item.className = "workorder-item";
      item.innerHTML = `
        <div>
          <strong>${workOrder.id}</strong>
          <span>${workOrder.title}</span>
        </div>
        <mark>${workOrder.status} · ${workOrder.overdueHours}h</mark>
      `;
      return item;
    }),
  );
}

function renderFaults(faults) {
  metricTargets.faultList.replaceChildren(
    ...faults.map((fault, index) => {
      const item = document.createElement("div");
      item.className = "rank-item";
      item.innerHTML = `
        <span>${index + 1}</span>
        <div>
          <strong>${fault.name}</strong>
          <small>${fault.code} · ${fault.component}</small>
        </div>
        <b>${fault.count}</b>
      `;
      return item;
    }),
  );
}

function renderProblemTurbines(turbines) {
  metricTargets.problemTurbines.replaceChildren(
    ...turbines.map((turbine, index) => {
      const item = document.createElement("div");
      item.className = "rank-item";
      item.innerHTML = `
        <span>${index + 1}</span>
        <div>
          <strong>${turbine.id}</strong>
          <small>${turbine.windFarm} · ${turbine.openIssues} 个遗留问题</small>
        </div>
        <b>${turbine.downtimeHours}h</b>
      `;
      return item;
    }),
  );
}

function parseScope(value) {
  const [level, id] = value.split(":");
  return { level, id };
}

function percent(value, total) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

function formatCurrency(value) {
  if (value < 10000) return `¥${value.toLocaleString("zh-CN")}`;
  const tenThousand = Math.round((value / 10000) * 10) / 10;
  return `¥${tenThousand.toLocaleString("zh-CN")}万`;
}

async function loadWorkbenchData() {
  activeWorkOrderData = mockWorkOrderData;
}

async function renderWorkOrderBoard() {
  await loadWorkbenchData();
  const board = buildWorkOrderBoard(activeWorkOrderData);
  metricTargets.workOrderTotal.textContent = `${board.total} 单`;
  metricTargets.workOrderOverdue.textContent = board.overdue;
  metricTargets.waitingDispatch.textContent = board.waitingDispatch;
  metricTargets.waitingClimb.textContent = board.waitingClimb;

  metricTargets.workOrderColumns.replaceChildren(
    ...board.statusColumns.map((column) => {
      const item = document.createElement("div");
      item.className = "status-column";
      item.innerHTML = `
        <div class="status-column-title">
          <strong>${column.status}</strong>
          <span>${column.items.length} 单</span>
        </div>
        ${column.items
          .map(
            (workOrder) => `
              <button class="workorder-card" data-work-order-id="${workOrder.id}">
                <strong>${workOrder.title}</strong>
                <span>${workOrder.windFarmName} · ${workOrder.assignee}</span>
                ${workOrder.overdue ? "<mark>超期</mark>" : ""}
              </button>
            `,
          )
          .join("")}
      `;
      return item;
    }),
  );

  metricTargets.workOrderColumns.addEventListener("click", (event) => {
    const button = event.target.closest("[data-work-order-id]");
    if (!button) return;
    renderWorkOrderDetail(button.dataset.workOrderId);
  });

  renderWorkOrderDetail(board.statusColumns.flatMap((column) => column.items)[0]?.id);
}

function renderWorkOrderDetail(workOrderId) {
  if (!workOrderId || !activeWorkOrderData) {
    metricTargets.workOrderDetailStatus.textContent = "--";
    metricTargets.workOrderDetail.replaceChildren(messageBlock("暂无工单详情"));
    return;
  }

  const detail = findWorkOrderDetail(activeWorkOrderData, workOrderId);
  metricTargets.workOrderDetailStatus.textContent = detail.workOrder.status;
  metricTargets.workOrderDetail.replaceChildren();

  const summary = document.createElement("div");
  summary.className = "detail-block";
  summary.innerHTML = `
    <strong>${detail.workOrder.id}</strong>
    <span>${detail.workOrder.title}</span>
    <small>${detail.workOrder.windFarmName} · ${detail.workOrder.faultCode}</small>
  `;

  const fault = document.createElement("div");
  fault.className = "detail-block";
  fault.innerHTML = `
    <strong>关联故障</strong>
    <span>${detail.faultEvent?.code ?? "--"} · ${detail.faultEvent?.name ?? "--"}</span>
    <small>发现时间 ${formatDate(detail.faultEvent?.discoveredAt)}</small>
  `;

  const actions = document.createElement("div");
  actions.className = "detail-block";
  actions.innerHTML = `
    <strong>下一步动作</strong>
    <span>${detail.nextActions.join(" / ") || "暂无"}</span>
    <small>所有动作需写入审计日志</small>
  `;

  const audits = document.createElement("div");
  audits.className = "detail-block audit-block";
  audits.innerHTML = `
    <strong>审计轨迹</strong>
    ${detail.auditLogs
      .map((log) => `<small>${formatDate(log.at)} · ${log.operatorId} · ${log.from ?? "创建"} -> ${log.to}</small>`)
      .join("")}
  `;

  metricTargets.workOrderDetail.append(summary, fault, actions, audits);
}

function messageBlock(message) {
  const block = document.createElement("div");
  block.className = "detail-block";
  block.textContent = message;
  return block;
}

function formatDate(value) {
  if (!value) return "--";
  return value.replace("T", " ").replace("+08:00", "");
}

function renderMobileClimbCenter() {
  const tasks = buildMobileTaskList(mockClimbTaskData, mockClimbTaskData.currentUserId);
  metricTargets.mobileTaskCount.textContent = `${tasks.length} 项`;
  metricTargets.mobileTaskList.replaceChildren(
    ...tasks.map((task) => {
      const button = document.createElement("button");
      button.className = "mobile-task-card";
      button.dataset.climbTaskId = task.id;
      button.innerHTML = `
        <strong>${task.title}</strong>
        <span>${task.windFarmName} · ${task.turbineId}</span>
        <mark>${task.status}</mark>
      `;
      return button;
    }),
  );

  metricTargets.mobileTaskList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-climb-task-id]");
    if (!button) return;
    renderClimbTaskDetail(button.dataset.climbTaskId);
  });

  metricTargets.submitClimbTask.addEventListener("click", () => {
    const submitted = submitClimbTask(activeClimbTask, {
      operatorId: mockClimbTaskData.currentUserId,
      at: "2026-06-23T15:10:00+08:00",
      workSummary: metricTargets.workSummaryInput.value,
      mediaCount: 3,
      signature: metricTargets.signatureInput.value,
      sparePartUsages: [
        {
          partId: "SP-YAW-LIMIT-01",
          name: "偏航限位传感器",
          quantity: 1,
        },
      ],
    });
    activeClimbTask = submitted.task;
    metricTargets.climbTaskStatus.textContent = `${submitted.task.status} · 工单${submitted.workOrderStatus}`;
    metricTargets.submitHint.textContent = "登塔记录已提交，工单进入待复机验证。";
    metricTargets.submitClimbTask.disabled = true;
  });

  renderClimbTaskDetail(tasks[0].id);
}

function renderClimbTaskDetail(taskId) {
  const detail = findClimbTaskDetail(mockClimbTaskData, taskId);
  activeClimbTask = detail.task;
  metricTargets.climbTaskTitle.textContent = detail.task.title;
  metricTargets.climbTaskStatus.textContent = detail.task.status;
  metricTargets.climbTaskMeta.textContent = `${detail.task.windFarmName} · ${detail.task.turbineId} · ${detail.task.faultCode}`;
  metricTargets.submitHint.textContent = detail.canSubmit
    ? "可提交登塔记录。"
    : "完成全部安全确认后可提交。";
  metricTargets.submitClimbTask.disabled = !detail.canSubmit;
  metricTargets.safetyChecklist.replaceChildren(
    ...detail.safetyItems.map((item) => {
      const label = document.createElement("label");
      label.className = "check-item";
      label.innerHTML = `
        <input type="checkbox" data-safety-key="${item.key}" ${detail.task.safetyChecklist[item.key] ? "checked" : ""} />
        <span>${item.label}</span>
      `;
      return label;
    }),
  );
  metricTargets.safetyChecklist.addEventListener("change", handleSafetyChange, { once: true });
}

function handleSafetyChange() {
  const checkedItems = {};
  for (const input of metricTargets.safetyChecklist.querySelectorAll("[data-safety-key]")) {
    checkedItems[input.dataset.safetyKey] = input.checked;
  }

  try {
    const confirmed = confirmSafetyChecklist(activeClimbTask, {
      operatorId: mockClimbTaskData.currentUserId,
      at: "2026-06-23T13:45:00+08:00",
      checkedItems,
    });
    activeClimbTask = confirmed.task;
    metricTargets.climbTaskStatus.textContent = activeClimbTask.status;
    metricTargets.submitClimbTask.disabled = false;
    metricTargets.submitHint.textContent = "安全确认已完成，可提交登塔记录。";
  } catch {
    metricTargets.submitClimbTask.disabled = true;
    metricTargets.submitHint.textContent = "仍有安全确认项未完成。";
    metricTargets.safetyChecklist.addEventListener("change", handleSafetyChange, { once: true });
  }
}

function renderSparePartCenter() {
  const board = buildSparePartBoard(mockSparePartData);
  metricTargets.spareBoundCount.textContent = `${board.boundUsageCount} 条绑定`;
  metricTargets.spareTotalCost.textContent = formatCurrency(board.totalUsageCost);
  metricTargets.defectiveOpenCount.textContent = `${board.defectiveOpenCount} 件未闭环`;

  metricTargets.defectiveStatusList.replaceChildren(
    ...board.defectiveStatusCounts.map((item) => {
      const pill = document.createElement("div");
      pill.className = "status-pill";
      pill.innerHTML = `<strong>${item.count}</strong><span>${item.status}</span>`;
      return pill;
    }),
  );

  metricTargets.spareUsageTable.replaceChildren(
    ...board.recentUsages.map((usage) => {
      const row = document.createElement("div");
      row.className = "spare-row";
      row.innerHTML = `
        <div>
          <strong>${usage.name}</strong>
          <span>${usage.workOrderId} · ${usage.turbineId} · ${usage.faultCode}</span>
        </div>
        <b>${usage.quantity} 件</b>
        <b>${formatCurrency(usage.totalCost)}</b>
      `;
      return row;
    }),
  );

  metricTargets.defectivePartList.replaceChildren(
    ...board.defectiveParts.map((part) => {
      const item = document.createElement("div");
      item.className = "defective-item";
      item.innerHTML = `
        <div>
          <strong>${part.name}</strong>
          <span>${part.workOrderId} · ${part.turbineId} · ${part.faultCode}</span>
        </div>
        <mark>${part.status}</mark>
      `;
      return item;
    }),
  );
}

metricTargets.timelineTypeSelect.addEventListener("change", () => {
  renderTurbineHistory("DH-05", metricTargets.timelineTypeSelect.value);
});

function renderTurbineHistory(turbineId, type) {
  const history = buildTurbineHistory(mockTurbineHistoryData, turbineId);
  const timeline = filterTurbineTimeline(history.timeline, type);

  metricTargets.historyTurbineId.textContent = history.turbine.id;
  metricTargets.historyWindFarm.textContent = history.turbine.windFarmName;
  metricTargets.historyMeta.innerHTML = `
    <span>${history.turbine.model} · ${history.turbine.capacityMw}MW</span>
    <span>投运 ${history.turbine.commissionedAt}</span>
    <span>质保至 ${history.turbine.warrantyUntil}</span>
    <span>可利用率 ${history.turbine.availabilityRate}%</span>
  `;
  metricTargets.historyFaultCount.textContent = history.summary.faultCount;
  metricTargets.historyWorkOrderCount.textContent = history.summary.workOrderCount;
  metricTargets.historySpareCost.textContent = formatCurrency(history.summary.totalSparePartCost);
  metricTargets.historyOpenIssues.textContent = history.summary.openIssues;
  metricTargets.historyTimelineCount.textContent = `${timeline.length} 条`;
  metricTargets.historyTimeline.replaceChildren(
    ...timeline.map((item) => {
      const row = document.createElement("div");
      row.className = `timeline-item ${item.type}`;
      row.innerHTML = `
        <span>${typeLabel(item.type)}</span>
        <div>
          <strong>${item.title}</strong>
          <small>${formatDate(item.at)} · ${item.status}</small>
        </div>
      `;
      return row;
    }),
  );
}

function typeLabel(type) {
  return {
    fault: "故障",
    workOrder: "工单",
    climbTask: "登塔",
    sparePart: "备件",
    issue: "遗留",
  }[type] ?? type;
}

function renderKnowledgeAssistant() {
  const suggestion = buildKnowledgeSuggestion(mockKnowledgeData, {
    faultCode: "E-0908",
    component: "偏航系统",
    turbineModel: "WT-5.0",
  });

  metricTargets.suggestionTitle.textContent = suggestion.title;
  metricTargets.suggestionDisclaimer.textContent = suggestion.disclaimer;
  metricTargets.caseCount.textContent = `${suggestion.matchedCases.length} 条`;
  metricTargets.sopCount.textContent = `${suggestion.sops.length} 条`;
  metricTargets.suggestionEvidence.replaceChildren(
    ...suggestion.evidenceFields.map((field) => {
      const item = document.createElement("span");
      item.textContent = field;
      return item;
    }),
  );
  metricTargets.aiBoundaryList.replaceChildren(
    boundaryItem("不自动关闭工单", suggestion.canAutoCloseWorkOrder),
    boundaryItem("不自动生成维修结论", suggestion.canGenerateRepairConclusion),
    boundaryItem("必须人工确认", true),
  );
  metricTargets.knowledgeCaseList.replaceChildren(
    ...suggestion.matchedCases.map((item) => {
      const row = document.createElement("div");
      row.className = "knowledge-item";
      row.innerHTML = `
        <strong>${item.title}</strong>
        <span>${item.faultCode} · ${item.component} · 成功率 ${Math.round(item.successRate * 100)}%</span>
        <small>${item.resolution}</small>
      `;
      return row;
    }),
  );
  metricTargets.sopList.replaceChildren(
    ...suggestion.sops.map((item) => {
      const row = document.createElement("div");
      row.className = "knowledge-item";
      row.innerHTML = `
        <strong>${item.title}</strong>
        <span>${item.component} · ${item.turbineModel}</span>
        <small>${item.steps.join(" / ")}</small>
      `;
      return row;
    }),
  );

  metricTargets.adoptSuggestion.addEventListener("click", () => {
    renderSuggestionDecision(recordSuggestionDecision(suggestion, decisionContext("adopt")));
  });
  metricTargets.ignoreSuggestion.addEventListener("click", () => {
    renderSuggestionDecision(recordSuggestionDecision(suggestion, decisionContext("ignore")));
  });
}

function boundaryItem(label, state) {
  const item = document.createElement("div");
  item.className = "boundary-item";
  item.innerHTML = `<strong>${state ? "是" : "否"}</strong><span>${label}</span>`;
  return item;
}

function decisionContext(decision) {
  return {
    decision,
    operatorId: "pm-01",
    at: "2026-06-23T18:00:00+08:00",
  };
}

function renderSuggestionDecision(decision) {
  const label = decision.decision === "adopt" ? "已采纳" : "已忽略";
  metricTargets.suggestionDecisionHint.textContent = `${label}，工单状态未自动变更。`;
}

function initPhase3MobileSmokeCsvHelper() {
  const root = document.querySelector("#phase3MobileSmokePrecheck");
  const download = document.querySelector("#phase3MobileSmokeDownload");
  const progress = document.querySelector("#phase3MobileSmokeProgress");
  if (!root || !download || !progress) {
    return;
  }

  const rows = Array.from(root.querySelectorAll("[data-case-id]"));
  const sharedFields = [
    ["device", "#phase3MobileSmokeDevice"],
    ["browser", "#phase3MobileSmokeBrowser"],
    ["network", "#phase3MobileSmokeNetwork"],
    ["tested_at", "#phase3MobileSmokeTestedAt"],
  ];
  const header = "case_id,role,device,browser,network,tested_at,status,evidence_type,evidence_ref,evidence";

  const sharedValue = (selector) => document.querySelector(selector)?.value.trim() ?? "";
  const rowValue = (row, selector) => row.querySelector(selector)?.value.trim() ?? "";
  const csvEscape = (value) => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  const evidenceRefIdentifiesCase = (evidenceRef, caseId) =>
    evidenceRef.toLowerCase().includes(caseId.toLowerCase());
  const isLocalEvidenceRef = (evidenceRef) =>
    evidenceRef.startsWith("work/phase3-mobile-smoke/evidence/");
  const missingForRow = (row) => {
    const missing = [];
    const caseId = row.dataset.caseId;
    for (const [name, selector] of sharedFields) {
      if (!sharedValue(selector)) {
        missing.push(name);
      }
    }
    if (!rowValue(row, '[name="status"]')) {
      missing.push("status");
    }
    const evidenceRef = rowValue(row, '[name="evidence_ref"]');
    if (!evidenceRef) {
      missing.push("evidence_ref");
    } else if (!evidenceRefIdentifiesCase(evidenceRef, caseId)) {
      missing.push("evidence_ref包含P3-MS编号");
    }
    if (!rowValue(row, '[name="evidence"]')) {
      missing.push("evidence");
    }
    return missing;
  };
  const buildProgressText = () => {
    const missingByCase = rows.map((row) => [row.dataset.caseId, missingForRow(row)]);
    const complete = missingByCase.filter(([, missing]) => missing.length === 0).length;
    const firstMissing = missingByCase.find(([, missing]) => missing.length > 0);
    const hasLocalEvidenceRef = rows.some((row) => isLocalEvidenceRef(rowValue(row, '[name="evidence_ref"]')));
    const localEvidenceHint = hasLocalEvidenceRef ? "；本地证据文件已放入evidence目录后再运行 verify" : "";
    return firstMissing
      ? `已完成 ${complete}/${rows.length}；${firstMissing[0]} 缺字段：${firstMissing[1].join("、")}`
      : `已完成 ${complete}/${rows.length}${localEvidenceHint}；可下载 CSV 并运行 npm run phase3:mobile:smoke:verify`;
  };
  const buildCsv = () => {
    const shared = Object.fromEntries(sharedFields.map(([name, selector]) => [name, sharedValue(selector)]));
    const csvRows = rows.map((row) =>
      [
        row.dataset.caseId,
        row.dataset.role,
        shared.device,
        shared.browser,
        shared.network,
        shared.tested_at,
        rowValue(row, '[name="status"]'),
        row.dataset.evidenceType,
        rowValue(row, '[name="evidence_ref"]'),
        rowValue(row, '[name="evidence"]'),
      ]
        .map(csvEscape)
        .join(","),
    );
    return [header, ...csvRows, ""].join("\n");
  };
  const refresh = () => {
    progress.textContent = buildProgressText();
    download.href = `data:text/csv;charset=utf-8,${encodeURIComponent(buildCsv())}`;
  };

  root.querySelectorAll("input,select").forEach((control) => {
    control.addEventListener("input", refresh);
    control.addEventListener("change", refresh);
  });
  refresh();
}

function initPhase3BackupRestoreCsvHelper() {
  const root = document.querySelector("#phase3BackupRestorePrecheck");
  const download = document.querySelector("#phase3BackupRestoreDownload");
  if (!root || !download) {
    return;
  }

  const header =
    "project_ref,project_name,plan,backup_enabled,evidence_type,restore_point_at,evidence_ref,owner,verified_at,approver,status,notes";
  const fields = [
    ["plan", "#phase3BackupPlan"],
    ["backup_enabled", "#phase3BackupEnabled"],
    ["evidence_type", "#phase3BackupEvidenceType"],
    ["restore_point_at", "#phase3BackupRestorePointAt"],
    ["evidence_ref", "#phase3BackupEvidenceRef"],
    ["owner", "#phase3BackupOwner"],
    ["verified_at", "#phase3BackupVerifiedAt"],
    ["approver", "#phase3BackupApprover"],
  ];
  const value = (selector) => document.querySelector(selector)?.value.trim() ?? "";
  const csvEscape = (input) => {
    const text = String(input ?? "");
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  const buildCsv = () => {
    const values = Object.fromEntries(fields.map(([name, selector]) => [name, value(selector)]));
    const notes =
      values.evidence_type === "approved_equivalent"
        ? "approved equivalent requires completed approval"
        : "upgrade or approved equivalent required";
    const row = [
      "mrxcfsfooqaadywsmnzk",
      "wind-smart-ops-pilot",
      values.plan,
      values.backup_enabled,
      values.evidence_type,
      values.restore_point_at,
      values.evidence_ref,
      values.owner,
      values.verified_at,
      values.approver,
      "BLOCKED",
      notes,
    ];
    return [header, row.map(csvEscape).join(","), ""].join("\n");
  };
  const refresh = () => {
    download.href = `data:text/csv;charset=utf-8,${encodeURIComponent(buildCsv())}`;
  };

  root.querySelectorAll("input,select").forEach((control) => {
    control.addEventListener("input", refresh);
    control.addEventListener("change", refresh);
  });
  refresh();
}

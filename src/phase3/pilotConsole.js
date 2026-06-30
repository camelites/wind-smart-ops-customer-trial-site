const PHASE3_BASE = "/api/phase3";
const DEFAULT_SAFETY_CHECKLIST = ["ppe", "weather", "lockout", "rescue"];
export const STATIC_TRIAL_CREDENTIALS = {
  projectManager: {
    email: "pm.pilot@example.com",
    password: "Demo@2026pm",
    actor: { id: "pm-demo", displayName: "项目经理 钟月", role: "projectManager" },
  },
  fieldEngineer: {
    email: "field.pilot@example.com",
    password: "Demo@2026field",
    actor: { id: "field-demo", displayName: "现场工程师 周工", role: "fieldEngineer" },
  },
  systemAdmin: {
    email: "admin.pilot@example.com",
    password: "Demo@2026admin",
    actor: { id: "admin-demo", displayName: "系统管理员", role: "systemAdmin" },
  },
};

export function createPhase3PilotClient({
  fetchImpl = globalThis.fetch,
  initialSession = null,
} = {}) {
  let session = initialSession;
  let actor = null;

  async function request(path, { method = "GET", body, auth = true } = {}) {
    const headers = {
      Accept: "application/json",
    };

    if (body !== undefined) {
      headers["content-type"] = "application/json";
    }
    if (auth && session?.accessToken) {
      headers.authorization = `Bearer ${session.accessToken}`;
    }

    const response = await fetchImpl(`${PHASE3_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(`${payload.code ?? response.status}: ${payload.message ?? "Phase 3 request failed"}`);
    }

    return payload;
  }

  return {
    get session() {
      return session;
    },
    get actor() {
      return actor;
    },
    async login({ email, password }) {
      const result = await request("/login", {
        method: "POST",
        auth: false,
        body: { email, password },
      });
      session = result.session;
      actor = result.actor;
      return result;
    },
    async loadWorkbench() {
      return request("/workbench");
    },
    async requestAdminAuditLogs() {
      return request("/admin/audit-logs");
    },
    async importFaultEvents({ source = "pilot-console", csv }) {
      return request("/import/fault-events", {
        method: "POST",
        body: { source, csv },
      });
    },
    async listMobileTasks() {
      return request("/mobile/tasks");
    },
    async createDispatchableWorkOrder(input) {
      const fault = await request("/fault-events", {
        method: "POST",
        body: {
          windFarmId: input.windFarmId,
          turbineId: input.turbineId,
          faultCode: input.faultCode,
          component: input.component,
          description: input.description,
        },
      });
      const faultEventId = fault.faultEvent.id;

      await request(`/fault-events/${encodeURIComponent(faultEventId)}/confirm`, {
        method: "POST",
      });
      const workOrder = await request(`/fault-events/${encodeURIComponent(faultEventId)}/work-order`, {
        method: "POST",
      });
      const workOrderId = workOrder.workOrder.id;

      return request(`/work-orders/${encodeURIComponent(workOrderId)}/dispatch`, {
        method: "POST",
        body: { assigneeId: input.assigneeId },
      });
    },
    async completeMobileTask({
      taskId,
      description,
      result = "resolved",
      checklist = DEFAULT_SAFETY_CHECKLIST,
    }) {
      await request(`/mobile/tasks/${encodeURIComponent(taskId)}/accept`, { method: "POST" });
      await request(`/mobile/tasks/${encodeURIComponent(taskId)}/safety`, {
        method: "POST",
        body: { checklist },
      });
      await request(`/mobile/tasks/${encodeURIComponent(taskId)}/start`, { method: "POST" });
      const photo = await request(`/mobile/tasks/${encodeURIComponent(taskId)}/attachments`, {
        method: "POST",
        body: {
          file: {
            contentType: "image/jpeg",
            size: 2048,
            originalName: "pilot-task-photo.jpg",
          },
          location: { source: "manual" },
        },
      });
      const signature = await request(`/mobile/tasks/${encodeURIComponent(taskId)}/signature`, {
        method: "POST",
        body: {
          signatureImage: {
            contentType: "image/png",
            size: 512,
            originalName: "pilot-signature.png",
          },
        },
      });

      return request(`/mobile/tasks/${encodeURIComponent(taskId)}/submit`, {
        method: "POST",
        body: {
          description,
          result,
          attachmentIds: [photo.attachment.id],
          signatureAttachmentId: signature.attachment.id,
        },
      });
    },
    async verifyAndCloseWorkOrder({ workOrderId }) {
      await request(`/work-orders/${encodeURIComponent(workOrderId)}/verify`, {
        method: "POST",
      });
      return request(`/work-orders/${encodeURIComponent(workOrderId)}/close`, {
        method: "POST",
      });
    },
  };
}

export function createPhase3PilotRoleConsole({ fetchImpl = globalThis.fetch } = {}) {
  const projectManager = createPhase3PilotClient({ fetchImpl });
  const fieldEngineer = createPhase3PilotClient({ fetchImpl });
  const systemAdmin = createPhase3PilotClient({ fetchImpl });

  return {
    projectManager,
    fieldEngineer,
    systemAdmin,
    async loginProjectManager(credentials) {
      return projectManager.login(credentials);
    },
    async loginFieldEngineer(credentials) {
      return fieldEngineer.login(credentials);
    },
    async loginSystemAdmin(credentials) {
      return systemAdmin.login(credentials);
    },
    async createDispatchableWorkOrder(input) {
      return projectManager.createDispatchableWorkOrder(input);
    },
    async importFaultEvents(input) {
      return projectManager.importFaultEvents(input);
    },
    async loadWorkbench() {
      return projectManager.loadWorkbench();
    },
    async listMobileTasks() {
      return fieldEngineer.listMobileTasks();
    },
    async completeMobileTask(input) {
      return fieldEngineer.completeMobileTask(input);
    },
    async loadAuditLogs() {
      return systemAdmin.requestAdminAuditLogs();
    },
  };
}

export function createStaticTrialRoleConsole() {
  const state = {
    sessions: {
      projectManager: null,
      fieldEngineer: null,
      systemAdmin: null,
    },
    summary: {
      pending: 1,
      dispatched: 1,
      waitingVerification: 0,
    },
    auditLogs: [
      { id: "AUD-DEMO-001", action: "demo.login.ready", actorRole: "system", objectType: "trial" },
    ],
    latestWorkOrder: null,
    latestClimbTask: null,
  };

  const login = (role, credentials) => {
    const demo = STATIC_TRIAL_CREDENTIALS[role];
    if (credentials.email !== demo.email || credentials.password !== demo.password) {
      throw new Error("演示账号或密码不正确。");
    }
    const session = { accessToken: `static-${role}-demo-token` };
    state.sessions[role] = session;
    state.auditLogs.unshift({
      id: nextAuditId(state),
      action: "demo.login",
      actorRole: demo.actor.role,
      objectType: "session",
    });
    return { session, actor: demo.actor };
  };

  return {
    projectManager: {
      get session() {
        return state.sessions.projectManager;
      },
      async verifyAndCloseWorkOrder({ workOrderId }) {
        state.summary.waitingVerification = Math.max(0, state.summary.waitingVerification - 1);
        if (state.latestWorkOrder?.id === workOrderId) {
          state.latestWorkOrder = { ...state.latestWorkOrder, status: "closed" };
        }
        state.auditLogs.unshift({
          id: nextAuditId(state),
          action: "work_order.closed",
          actorRole: "projectManager",
          objectType: "workOrder",
        });
        return { workOrder: { id: workOrderId, status: "closed" } };
      },
    },
    fieldEngineer: {
      get session() {
        return state.sessions.fieldEngineer;
      },
    },
    systemAdmin: {
      get session() {
        return state.sessions.systemAdmin;
      },
    },
    async loginProjectManager(credentials) {
      return login("projectManager", credentials);
    },
    async loginFieldEngineer(credentials) {
      return login("fieldEngineer", credentials);
    },
    async loginSystemAdmin(credentials) {
      return login("systemAdmin", credentials);
    },
    async createDispatchableWorkOrder(input) {
      if (!state.sessions.projectManager) {
        throw new Error("请先登录项目经理。");
      }
      const suffix = String(Date.now()).slice(-4);
      const workOrder = {
        id: `WO-DEMO-${suffix}`,
        status: "dispatched",
        turbineId: input.turbineId,
      };
      const climbTask = {
        id: `CT-DEMO-${suffix}`,
        status: "assigned",
        turbineId: input.turbineId,
      };
      state.latestWorkOrder = workOrder;
      state.latestClimbTask = climbTask;
      state.summary.pending = Math.max(0, state.summary.pending - 1);
      state.summary.dispatched += 1;
      state.auditLogs.unshift({
        id: nextAuditId(state),
        action: "work_order.dispatched",
        actorRole: "projectManager",
        objectType: "workOrder",
      });
      return { workOrder, climbTask };
    },
    async importFaultEvents() {
      state.summary.pending += 1;
      state.auditLogs.unshift({
        id: nextAuditId(state),
        action: "fault_event.imported",
        actorRole: "projectManager",
        objectType: "faultEvent",
      });
      return { importedCount: 1, faultEvents: [{ id: "FE-DEMO-001" }] };
    },
    async loadWorkbench() {
      return {
        summary: state.summary,
        latestWorkOrder: state.latestWorkOrder,
        latestClimbTask: state.latestClimbTask,
      };
    },
    async listMobileTasks() {
      return {
        tasks: [
          { id: "CT-DEMO-001", turbineId: "DH-05", status: "assigned" },
        ],
      };
    },
    async completeMobileTask({ taskId }) {
      state.summary.waitingVerification += 1;
      state.auditLogs.unshift({
        id: nextAuditId(state),
        action: "climb_task.submitted",
        actorRole: "fieldEngineer",
        objectType: "climbTask",
      });
      const workOrder = state.latestWorkOrder ?? { id: "WO-DEMO-001", status: "waitingVerification" };
      return { task: { id: taskId, status: "submitted" }, workOrder };
    },
    async loadAuditLogs() {
      return {
        summary: { totalAuditLogs: state.auditLogs.length },
        auditLogs: state.auditLogs,
      };
    },
  };
}

export function bindPhase3PilotConsole({
  root = document,
  fetchImpl = globalThis.fetch,
  staticTrialMode = isStaticTrialMode(),
} = {}) {
  const container = root.querySelector("#phase3PilotConsole");
  if (!container) return null;

  const client = staticTrialMode ? createStaticTrialRoleConsole() : createPhase3PilotRoleConsole({ fetchImpl });
  let latestSubmittedWorkOrderId = null;
  const targets = {
    pmEmail: root.querySelector("#phase3PmLoginEmail"),
    pmPassword: root.querySelector("#phase3PmLoginPassword"),
    pmLogin: root.querySelector("#phase3PmLoginButton"),
    pmLoginStatus: root.querySelector("#phase3PmLoginStatus"),
    fieldEmail: root.querySelector("#phase3FieldLoginEmail"),
    fieldPassword: root.querySelector("#phase3FieldLoginPassword"),
    fieldLogin: root.querySelector("#phase3FieldLoginButton"),
    fieldLoginStatus: root.querySelector("#phase3FieldLoginStatus"),
    adminEmail: root.querySelector("#phase3AdminLoginEmail"),
    adminPassword: root.querySelector("#phase3AdminLoginPassword"),
    adminLogin: root.querySelector("#phase3AdminLoginButton"),
    adminLoginStatus: root.querySelector("#phase3AdminLoginStatus"),
    faultForm: root.querySelector("#phase3FaultForm"),
    faultStatus: root.querySelector("#phase3FaultStatus"),
    importCsv: root.querySelector("#phase3ImportCsv"),
    importFaults: root.querySelector("#phase3ImportFaults"),
    importStatus: root.querySelector("#phase3ImportStatus"),
    workbench: root.querySelector("#phase3WorkbenchSnapshot"),
    loadTasks: root.querySelector("#phase3LoadTasks"),
    completeTask: root.querySelector("#phase3CompleteTask"),
    taskSelect: root.querySelector("#phase3TaskSelect"),
    fieldStatus: root.querySelector("#phase3FieldStatus"),
    verifyClose: root.querySelector("#phase3VerifyCloseWorkOrder"),
    verificationStatus: root.querySelector("#phase3VerificationStatus"),
    loadAudit: root.querySelector("#phase3LoadAudit"),
    auditStatus: root.querySelector("#phase3AuditStatus"),
    auditSnapshot: root.querySelector("#phase3AuditSnapshot"),
  };

  targets.pmLogin?.addEventListener("click", async () => {
    await runAction(targets.pmLoginStatus, async () => {
      if (!targets.pmPassword.value.trim()) {
        return "请输入项目经理密码。";
      }
      const result = await client.loginProjectManager({
        email: targets.pmEmail.value,
        password: targets.pmPassword.value,
      });
      return `已登录：${result.actor.displayName}（${roleLabel(result.actor.role)}）`;
    });
  });

  targets.fieldLogin?.addEventListener("click", async () => {
    await runAction(targets.fieldLoginStatus, async () => {
      if (!targets.fieldPassword.value.trim()) {
        return "请输入现场工程师密码。";
      }
      const result = await client.loginFieldEngineer({
        email: targets.fieldEmail.value,
        password: targets.fieldPassword.value,
      });
      return `已登录：${result.actor.displayName}（${roleLabel(result.actor.role)}）`;
    });
  });

  targets.adminLogin?.addEventListener("click", async () => {
    await runAction(targets.adminLoginStatus, async () => {
      if (!targets.adminPassword.value.trim()) {
        return "请输入系统管理员密码。";
      }
      const result = await client.loginSystemAdmin({
        email: targets.adminEmail.value,
        password: targets.adminPassword.value,
      });
      return `已登录：${result.actor.displayName}（${roleLabel(result.actor.role)}）`;
    });
  });

  targets.faultForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await runAction(targets.faultStatus, async () => {
      if (!client.projectManager.session) {
        return "请先登录项目经理，再登记故障并派发工单。";
      }
      const form = new FormData(targets.faultForm);
      const input = Object.fromEntries(form.entries());
      if (!hasRequiredFaultFields(input)) {
        return "请补齐风场、机组、故障代码、部件、故障描述和派发对象。";
      }
      const result = await client.createDispatchableWorkOrder(input);
      latestSubmittedWorkOrderId = result.workOrder.id;
      if (targets.verifyClose) {
        targets.verifyClose.disabled = false;
      }
      const workbench = await client.loadWorkbench();
      renderWorkbenchSnapshot(targets.workbench, workbench);
      return `工单 ${result.workOrder.id} 已进入派发处理链路。`;
    });
  });

  targets.importFaults?.addEventListener("click", async () => {
    await runAction(targets.importStatus, async () => {
      const result = await client.importFaultEvents({
        csv: targets.importCsv.value,
      });
      const workbench = await client.loadWorkbench();
      renderWorkbenchSnapshot(targets.workbench, workbench);
      return `已导入 ${result.importedCount} 条故障事件`;
    });
  });

  targets.loadTasks?.addEventListener("click", async () => {
    await runAction(targets.fieldStatus, async () => {
      const result = await client.listMobileTasks();
      renderTaskOptions(targets.taskSelect, result.tasks ?? []);
      targets.completeTask.disabled = (result.tasks?.length ?? 0) === 0;
      return `已加载 ${result.tasks?.length ?? 0} 个任务`;
    });
  });

  targets.completeTask?.addEventListener("click", async () => {
    await runAction(targets.fieldStatus, async () => {
      const taskId = targets.taskSelect.value;
      if (!taskId) {
        return "请先加载并选择一个任务。";
      }
      const result = await client.completeMobileTask({
        taskId,
        description: "Pilot 现场作业已完成，等待项目经理复核。",
      });
      latestSubmittedWorkOrderId = result.workOrder.id;
      if (targets.verifyClose) {
        targets.verifyClose.disabled = false;
      }
      return `任务 ${result.task.id} 已提交，工单状态 ${result.workOrder.status}`;
    });
  });

  targets.verifyClose?.addEventListener("click", async () => {
    await runAction(targets.verificationStatus, async () => {
      if (!latestSubmittedWorkOrderId) {
        return "请先完成一个现场任务提交。";
      }
      const result = await client.projectManager.verifyAndCloseWorkOrder({
        workOrderId: latestSubmittedWorkOrderId,
      });
      const workbench = await client.loadWorkbench();
      renderWorkbenchSnapshot(targets.workbench, workbench);
      return `工单 ${result.workOrder.id} 已完成复机验收并关闭。`;
    });
  });

  targets.loadAudit?.addEventListener("click", async () => {
    await runAction(targets.auditStatus, async () => {
      if (!client.systemAdmin.session) {
        return "请先登录系统管理员，再加载审计记录。";
      }
      const result = await client.loadAuditLogs();
      renderAuditSnapshot(targets.auditSnapshot, result.auditLogs ?? []);
      return `已加载 ${result.summary?.totalAuditLogs ?? 0} 条审计记录`;
    });
  });

  return client;
}

function isStaticTrialMode({ location = globalThis.location } = {}) {
  return Boolean(
    globalThis.__STATIC_CUSTOMER_TRIAL__ === true ||
      location?.hostname === "camelites.github.io" ||
      location?.protocol === "file:",
  );
}

function nextAuditId(state) {
  return `AUD-DEMO-${String(state.auditLogs.length + 1).padStart(3, "0")}`;
}

function hasRequiredFaultFields(input) {
  return ["windFarmId", "turbineId", "faultCode", "component", "description", "assigneeId"].every((key) =>
    String(input[key] ?? "").trim(),
  );
}

function roleLabel(role) {
  return (
    {
      projectManager: "项目经理",
      fieldEngineer: "现场工程师",
      systemAdmin: "系统管理员",
    }[role] ?? role
  );
}

async function runAction(target, action) {
  try {
    target.textContent = "处理中...";
    target.textContent = await action();
  } catch (error) {
    target.textContent = error.message;
  }
}

function renderWorkbenchSnapshot(target, workbench) {
  if (!target) return;
  const summary = workbench.summary ?? {};
  const latest = workbench.latestWorkOrder;
  target.replaceChildren(
    createMetricStrip([
      ["待派发", summary.pending ?? 0],
      ["已派发", summary.dispatched ?? 0],
      ["待复机", summary.waitingVerification ?? 0],
    ]),
    createFlowCard({
      title: latest ? `${latest.id} · ${latest.turbineId ?? "DH-05"}` : "本轮演示工单",
      status: latest ? statusLabel(latest.status) : "等待派发",
      lines: latest
        ? ["故障：偏航电机过载", "处理链路：项目经理派发 -> 复机验收 -> 审计留痕"]
        : ["登录项目经理后提交故障，系统会生成工单卡片。"],
    }),
  );
}

function renderTaskOptions(select, tasks) {
  if (!select) return;
  select.replaceChildren(
    ...tasks.map((task) => {
      const option = document.createElement("option");
      option.value = task.id;
      option.textContent = `${task.id} · ${task.turbineId ?? "--"} · ${task.status}`;
      return option;
    }),
  );
}

function renderAuditSnapshot(target, auditLogs) {
  if (!target) return;
  if (auditLogs.length === 0) {
    target.textContent = "暂无审计记录。";
    return;
  }

  target.replaceChildren(
    ...auditLogs.slice(0, 6).map((log) => {
      const item = document.createElement("div");
      item.className = "audit-row";
      item.innerHTML = `
        <strong>${log.id}</strong>
        <span>${actionLabel(log.action)} · ${roleLabel(log.actorRole) ?? "--"} · ${objectTypeLabel(log.objectType)}</span>
      `;
      return item;
    }),
  );
}

function createMetricStrip(items) {
  const strip = document.createElement("div");
  strip.className = "trial-metric-strip";
  for (const [label, value] of items) {
    const item = document.createElement("div");
    item.innerHTML = `<strong>${value}</strong><span>${label}</span>`;
    strip.append(item);
  }
  return strip;
}

function createFlowCard({ title, status, lines }) {
  const card = document.createElement("div");
  card.className = "trial-flow-card";
  card.innerHTML = `
    <div><strong>${title}</strong><mark>${status}</mark></div>
    ${lines.map((line) => `<span>${line}</span>`).join("")}
  `;
  return card;
}

function statusLabel(status) {
  return (
    {
      dispatched: "已派发",
      waitingVerification: "待复机验收",
      closed: "已关闭",
    }[status] ?? status
  );
}

function actionLabel(action) {
  return (
    {
      "demo.login.ready": "演示环境就绪",
      "demo.login": "角色登录",
      "work_order.dispatched": "工单派发",
      "climb_task.submitted": "现场提交",
      "work_order.closed": "复机验收关闭",
      "fault_event.imported": "故障导入",
    }[action] ?? action
  );
}

function objectTypeLabel(objectType) {
  return (
    {
      trial: "演示环境",
      session: "会话",
      workOrder: "工单",
      climbTask: "登塔任务",
      faultEvent: "故障事件",
    }[objectType] ?? objectType ?? "--"
  );
}

import {
  DEFAULT_BOOK,
  DEFAULT_SETTINGS,
  EMPTY_MEMORY,
  buildFeedback,
  buildDailySummary,
  completeTask,
  evaluatePracticeAnswers,
  formatLocalDateIso,
  generateSummerPlan,
  getTaskForDate,
  restoreMemory,
  sanitizePersistencePayload
} from "./mathBuddyEngine.js?v=20260705b";
import { MATH_THINKING_CHAPTER_2_PROFILE } from "./mathThinkingChapter2Content.js?v=20260705b";

const STORAGE_KEY = "math-buddy-growth-memory-v1";
const SUBMISSIONS_STORAGE_KEY = "math-buddy-daily-submissions-v1";
const initialToday = formatLocalDateIso();

const state = {
  settings: { ...DEFAULT_SETTINGS },
  book: {
    ...DEFAULT_BOOK,
    title: MATH_THINKING_CHAPTER_2_PROFILE.bookTitle,
    toc: MATH_THINKING_CHAPTER_2_PROFILE.units.map((unit) => unit.title)
  },
  contentProfile: MATH_THINKING_CHAPTER_2_PROFILE,
  photoFile: null,
  photoRecognition: null,
  memory: restoreMemory(localStorage.getItem(STORAGE_KEY)),
  dailySubmissions: restoreDailySubmissions(localStorage.getItem(SUBMISSIONS_STORAGE_KEY)),
  plan: null,
  today: initialToday,
  selectedDate: initialToday,
  hydratedTaskId: null,
  lastPracticeResult: null,
  lastSummary: null
};

const elements = {
  learnerName: document.querySelector("#learnerName"),
  startDate: document.querySelector("#startDate"),
  endDate: document.querySelector("#endDate"),
  dailyMinutes: document.querySelector("#dailyMinutes"),
  includeWeekends: document.querySelector("#includeWeekends"),
  tocText: document.querySelector("#tocText"),
  navButtons: Array.from(document.querySelectorAll(".nav-button")),
  pages: Array.from(document.querySelectorAll("[data-page]")),
  planSummary: document.querySelector("#planSummary"),
  todayDateLabel: document.querySelector("#todayDateLabel"),
  unitSelect: document.querySelector("#unitSelect"),
  taskPanel: document.querySelector("#taskPanel"),
  practicePanel: document.querySelector("#practicePanel"),
  photoInput: document.querySelector("#photoInput"),
  photoPreview: document.querySelector("#photoPreview"),
  recognizePhoto: document.querySelector("#recognizePhoto"),
  photoEvidencePanel: document.querySelector("#photoEvidencePanel"),
  evidence: document.querySelector("#evidence"),
  reflection: document.querySelector("#reflection"),
  dailySummaryPanel: document.querySelector("#dailySummaryPanel"),
  feedbackPanel: document.querySelector("#feedbackPanel"),
  memoryPanel: document.querySelector("#memoryPanel"),
  timeline: document.querySelector("#timeline"),
  generatePlan: document.querySelector("#generatePlan"),
  resetMemory: document.querySelector("#resetMemory")
};

function init() {
  elements.learnerName.value = state.settings.learnerName;
  elements.startDate.value = state.settings.startDate;
  elements.endDate.value = state.settings.endDate;
  elements.dailyMinutes.value = state.settings.dailyMinutes;
  elements.includeWeekends.checked = state.settings.includeWeekends;
  elements.tocText.value = state.book.toc.join("\n");

  elements.navButtons.forEach((button) => button.addEventListener("click", () => showPage(button.dataset.view)));
  elements.generatePlan.addEventListener("click", onGeneratePlan);
  document.addEventListener("click", (event) => {
    if (event.target?.id === "submitPractice") onSubmitPractice();
    if (event.target?.id === "submitLearningRecord") onSubmitLearningRecord();
    if (event.target?.id === "submitDiscovery") onSubmitDiscovery();
  });
  document.addEventListener("input", (event) => {
    if (event.target?.classList?.contains("practice-answer") || event.target?.id === "reflection") updateSubmitButtonState();
  });
  elements.resetMemory.addEventListener("click", onResetMemory);
  elements.unitSelect.addEventListener("change", () => {
    state.selectedDate = elements.unitSelect.value;
    state.hydratedTaskId = null;
    state.lastPracticeResult = null;
    state.lastSummary = null;
    hydrateTaskInputs();
    renderAll();
  });
  elements.photoInput.addEventListener("change", onPhotoSelected);
  elements.recognizePhoto.addEventListener("click", onRecognizePhoto);

  onGeneratePlan();
}

function showPage(pageName) {
  elements.pages.forEach((page) => page.classList.toggle("page-active", page.dataset.page === pageName));
  elements.navButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === pageName));
}

function onGeneratePlan() {
  state.today = formatLocalDateIso();
  state.settings = {
    ...state.settings,
    learnerName: elements.learnerName.value.trim() || DEFAULT_SETTINGS.learnerName,
    startDate: elements.startDate.value,
    endDate: elements.endDate.value,
    dailyMinutes: Number(elements.dailyMinutes.value) || DEFAULT_SETTINGS.dailyMinutes,
    includeWeekends: elements.includeWeekends.checked
  };
  state.book = {
    ...state.book,
    title: MATH_THINKING_CHAPTER_2_PROFILE.bookTitle,
    toc: MATH_THINKING_CHAPTER_2_PROFILE.units.map((unit) => unit.title)
  };
  state.plan = generateSummerPlan({ book: state.book, settings: state.settings, memory: state.memory, contentProfile: state.contentProfile });
  state.selectedDate = state.plan.tasks.some((task) => task.date === state.selectedDate) ? state.selectedDate : chooseDefaultSelectedDate();
  state.hydratedTaskId = null;
  state.lastPracticeResult = null;
  state.lastSummary = null;
  hydrateTaskInputs();
  renderAll();
}

function onSubmitPractice() {
  const task = getTaskForDate(state.plan, state.selectedDate);
  if (!task) return;
  const submission = getTaskSubmission(task);
  if (submission.practice || isTaskDone(task)) return;
  if (!arePracticeAnswersComplete(task)) return updateSubmitButtonState();
  const practiceResult = evaluatePracticeAnswers(task.practiceSet, collectPracticeAnswers());
  submission.practice = {
    submittedAt: new Date().toISOString(),
    result: practiceResult,
    answers: collectPracticeAnswers()
  };
  state.lastPracticeResult = practiceResult;
  persistDailySubmissions();
  finalizeTaskIfReady(task);
  renderAll(true);
}

function onSubmitLearningRecord() {
  const task = getTaskForDate(state.plan, state.selectedDate);
  if (!task) return;
  const submission = getTaskSubmission(task);
  if (submission.learningRecord || isTaskDone(task)) return;
  const text = elements.evidence.value.trim();
  if (!text) return updateSubmitButtonState();
  submission.learningRecord = {
    submittedAt: new Date().toISOString(),
    text
  };
  persistDailySubmissions();
  finalizeTaskIfReady(task);
  renderAll(true);
}

function onSubmitDiscovery() {
  const task = getTaskForDate(state.plan, state.selectedDate);
  if (!task) return;
  const submission = getTaskSubmission(task);
  if (submission.discovery || isTaskDone(task)) return;
  const text = elements.reflection.value.trim();
  if (!text) return updateSubmitButtonState();
  submission.discovery = {
    submittedAt: new Date().toISOString(),
    text
  };
  persistDailySubmissions();
  finalizeTaskIfReady(task);
  renderAll(true);
}

function finalizeTaskIfReady(task) {
  const submission = getTaskSubmission(task);
  if (isTaskDone(task) || !submission.practice || !submission.learningRecord || !submission.discovery) return;
  const practiceResult = submission.practice.result;
  state.memory = completeTask({
    memory: state.memory,
    task,
    evidence: submission.learningRecord.text,
    reflection: submission.discovery.text,
    practiceResult,
    completedAt: `${state.selectedDate}T09:00:00.000Z`
  });
  state.lastPracticeResult = practiceResult;
  state.lastSummary = buildDailySummary({
    task,
    practiceResult,
    evidence: submission.learningRecord.text,
    reflection: submission.discovery.text,
    memory: state.memory
  });
  localStorage.setItem(STORAGE_KEY, sanitizePersistencePayload(state.memory));
}

function onResetMemory() {
  state.memory = restoreMemory("");
  state.dailySubmissions = {};
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SUBMISSIONS_STORAGE_KEY);
  state.lastPracticeResult = null;
  state.lastSummary = null;
  elements.evidence.value = "";
  elements.reflection.value = "";
  state.photoFile = null;
  state.photoRecognition = null;
  elements.photoPreview.hidden = true;
  elements.photoPreview.removeAttribute("src");
  elements.photoEvidencePanel.textContent = "可以选择相册里的笔记，也可以用手机直接拍照。上传后，我会帮你整理学习记录草稿。";
  renderAll();
}

function onPhotoSelected(event) {
  const file = event.target.files?.[0];
  state.photoFile = file || null;
  state.photoRecognition = null;
  if (!file) {
    elements.photoPreview.hidden = true;
    elements.photoPreview.removeAttribute("src");
    elements.evidence.value = "";
    elements.photoEvidencePanel.textContent = "可以选择相册里的笔记，也可以用手机直接拍照。上传后，我会帮你整理学习记录草稿。";
    return;
  }

  elements.photoPreview.src = URL.createObjectURL(file);
  elements.photoPreview.hidden = false;
  elements.photoEvidencePanel.textContent = `已选择：${file.name}。点击“帮我整理学习记录”生成学习记录草稿。`;
  updateSubmitButtonState();
}

async function onRecognizePhoto() {
  if (!state.photoFile) {
    elements.photoEvidencePanel.textContent = "请先拍照或选择一张练习照片。";
    return;
  }

  elements.recognizePhoto.disabled = true;
  elements.photoEvidencePanel.textContent = "正在整理照片线索...";
  try {
    const formData = new FormData();
    formData.append("image", state.photoFile);
    const response = await fetch("/api/photo-evidence", { method: "POST", body: formData });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error || "照片识别失败。");
    state.photoRecognition = payload;
    renderPhotoEvidence(payload);
  } catch (error) {
    try {
      const payload = await analyzePracticePhotoInBrowser(state.photoFile);
      state.photoRecognition = payload;
      renderPhotoEvidence(payload);
    } catch (fallbackError) {
      elements.photoEvidencePanel.textContent = fallbackError instanceof Error ? fallbackError.message : "照片线索整理失败。";
    }
  } finally {
    elements.recognizePhoto.disabled = false;
  }
}

async function analyzePracticePhotoInBrowser(file) {
  const image = await loadImage(file);
  const maxSide = 360;
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("当前浏览器无法分析照片。");
  context.drawImage(image, 0, 0, width, height);
  const pixels = context.getImageData(0, 0, width, height).data;
  const grays = [];
  let darkPixels = 0;
  let edgeSum = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    const gray = Math.round(0.299 * pixels[index] + 0.587 * pixels[index + 1] + 0.114 * pixels[index + 2]);
    grays.push(gray);
    if (gray < 120) darkPixels += 1;
  }
  for (let index = width + 1; index < grays.length; index += 1) {
    edgeSum += Math.abs(grays[index] - grays[index - 1]);
  }
  const brightness = round(mean(grays), 1);
  const contrast = round(stddev(grays, brightness), 1);
  const darkRatio = round(darkPixels / grays.length, 3);
  const edgeMean = round(edgeSum / Math.max(1, grays.length - width - 1), 1);
  const quality = inferBrowserImageQuality(image.naturalWidth, image.naturalHeight, brightness, contrast, darkRatio);
  const confidence = quality === "clear" ? "medium" : "low";

  return {
    evidenceDraft: {
      extractedStudentWorkSummary: `已整理一张学生练习照片：${file.name}，尺寸 ${image.naturalWidth}x${image.naturalHeight}，清晰度判断为${quality}。请确认照片中的解题步骤、条件和检查点。`,
      observedSteps: buildBrowserObservedSteps(image.naturalWidth, image.naturalHeight, brightness, contrast, edgeMean, darkRatio),
      possibleMistakes: buildBrowserPossibleMistakes(quality, brightness, contrast, darkRatio),
      domainSignals: ["math_thinking: practice photo", "student-created evidence confirmation needed"],
      imageMetrics: { width: image.naturalWidth, height: image.naturalHeight, brightness, contrast, edgeMean, darkRatio },
      confidence
    },
    warnings: [
      "当前为浏览器端照片线索整理；结果是图像质量和可见书写痕迹分析，不是文字转写。",
      "请学生或家长确认照片中的实际解题步骤后再保存为学习证据。"
    ],
    limitations: ["不会保存上传图片。", "不会把图片上传到外部服务。", "无法可靠读取手写文字或书籍原题内容。"]
  };
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("无法读取这张照片。"));
    };
    image.src = url;
  });
}

function inferBrowserImageQuality(width, height, brightness, contrast, darkRatio) {
  if (width < 700 || height < 700) return "偏低，需要更近距离重拍";
  if (brightness < 55) return "偏暗，需要补光";
  if (contrast < 22 && darkRatio < 0.04) return "书写痕迹偏弱，需要更清楚的照片";
  return "clear";
}

function buildBrowserObservedSteps(width, height, brightness, contrast, edgeMean, darkRatio) {
  const steps = [
    "照片已作为学生自创练习证据入口。",
    "请确认是否能看到题目条件、解题步骤和最后检查。"
  ];
  steps.push(width >= height ? "图片为横向构图，适合整页作业；请确认关键步骤没有被裁掉。" : "图片为竖向构图，适合单题或半页作业；请确认上下步骤完整。");
  if (darkRatio >= 0.05) steps.push("检测到较明显书写/线条痕迹，可用于后续人工确认。");
  if (edgeMean >= 8) steps.push("检测到较多边缘线条，可能包含算式、图形或表格。");
  if (brightness < 70) steps.push("画面偏暗，建议补光后再拍一张以便识别。");
  if (contrast < 22) steps.push("对比度偏低，建议使用深色笔或提高拍摄清晰度。");
  return steps;
}

function buildBrowserPossibleMistakes(quality, brightness, contrast, darkRatio) {
  const mistakes = [];
  if (quality !== "clear") mistakes.push("图片质量可能影响证据判断。");
  if (brightness < 70) mistakes.push("照片偏暗，可能看不清运算符号或集合符号。");
  if (contrast < 22) mistakes.push("书写和纸面区分度不高，可能漏看步骤。");
  if (darkRatio < 0.025) mistakes.push("检测到的书写痕迹较少，请确认是否拍到了完整作答。");
  return mistakes.length ? mistakes : ["请重点检查：条件是否写全、步骤是否有依据、最后是否有合理性检查。"];
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
}

function stddev(values, average) {
  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / Math.max(1, values.length);
  return Math.sqrt(variance);
}

function round(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function renderPhotoEvidence(payload) {
  const draft = payload.evidenceDraft;
  const evidenceText = buildPhotoEvidenceText(payload);
  elements.photoEvidencePanel.innerHTML = `
    <div class="photo-draft">
      <strong>照片证据草稿 · ${escapeHtml(draft.confidence)} 置信度</strong>
      <p>${escapeHtml(draft.extractedStudentWorkSummary)}</p>
      <h3>识别到的可确认线索</h3>
      ${renderList(draft.observedSteps || [])}
      <h3>需要人工确认</h3>
      ${renderList(draft.possibleMistakes || [])}
      <button id="usePhotoEvidence" class="ghost" type="button">保存到学习记录</button>
      <p class="boundary">${escapeHtml((payload.warnings || []).join(" "))}</p>
    </div>
  `;
  document.querySelector("#usePhotoEvidence").addEventListener("click", () => {
    elements.evidence.value = evidenceText;
    elements.photoEvidencePanel.querySelector("#usePhotoEvidence").textContent = "已保存到学习记录";
    updateSubmitButtonState();
  });
}

function buildPhotoEvidenceText(payload) {
  const draft = payload.evidenceDraft;
  const steps = (draft.observedSteps || []).map((item) => `- ${item}`).join("\n");
  const checks = (draft.possibleMistakes || []).map((item) => `- ${item}`).join("\n");
  return [
    draft.extractedStudentWorkSummary,
    "照片识别线索：",
    steps,
    "学生/家长确认：请补充照片中实际写出的条件、步骤和最后检查。",
    "需要注意：",
    checks
  ].filter(Boolean).join("\n");
}

function renderAll(keepWriting = false) {
  hydrateTaskInputs();
  syncCurrentSubmissionState();
  renderPlan();
  renderTask(keepWriting);
  renderPractice();
  renderLearningRecordControls();
  renderDailySummary();
  renderMemory();
  renderTimeline();
}

function syncCurrentSubmissionState() {
  const task = getTaskForDate(state.plan, state.selectedDate);
  if (!task) return;
  const submission = getTaskSubmission(task);
  if (submission.practice?.result) state.lastPracticeResult = submission.practice.result;
  if (isTaskDone(task) && submission.practice?.result && submission.learningRecord?.text && submission.discovery?.text) {
    state.lastSummary = buildDailySummary({
      task,
      practiceResult: submission.practice.result,
      evidence: submission.learningRecord.text,
      reflection: submission.discovery.text,
      memory: state.memory
    });
  }
}

function renderPlan() {
  const taskCount = state.plan.tasks.length;
  const task = getTaskForDate(state.plan, state.selectedDate);
  elements.todayDateLabel.textContent = formatDisplayDate(state.selectedDate);
  elements.planSummary.innerHTML = `
    <div><strong>${task?.unitTitle || "-"}</strong><span>当前小节</span></div>
    <div><strong>${taskCount}</strong><span>预制任务</span></div>
    <div><strong>${state.memory.progress.completedTasks}</strong><span>已完成</span></div>
    <div><strong>${state.memory.progress.currentStreakDays}</strong><span>连续天数</span></div>
  `;
  elements.unitSelect.innerHTML = state.plan.tasks
    .map((task, index) => `<option value="${task.date}" ${task.date === state.selectedDate ? "selected" : ""}>${index + 1}. ${escapeHtml(task.unitTitle)}</option>`)
    .join("");
}

function renderTask(keepWriting = false) {
  const task = getTaskForDate(state.plan, state.selectedDate);
  if (!task) {
    elements.taskPanel.innerHTML = `<p class="muted">没有可派发的任务。请检查日期和目录。</p>`;
    return;
  }
  const done = isTaskDone(task);
  const feedback = buildFeedback({
    task,
    evidence: elements.evidence.value,
    reflection: elements.reflection.value,
    memory: state.memory,
    completed: done
  });

  elements.taskPanel.innerHTML = `
    <div class="task-date">${task.date}</div>
    <h2>${escapeHtml(task.unitTitle)}</h2>
    <p class="focus">${escapeHtml(task.focus)}</p>
    <div class="learning-path">
      <div><strong>1</strong><span>看知识卡片</span></div>
      <div><strong>2</strong><span>完成练习题</span></div>
      <div><strong>3</strong><span>提交学习记录</span></div>
    </div>
    <div>
      <span class="label">知识点卡片</span>
      ${renderKnowledgeCards(task.knowledgeCards || [])}
    </div>
    <div>
      <span class="label">要点归纳</span>
      ${renderList(task.keyTakeaways || [])}
    </div>
    ${done ? `<div class="done">三项都已完成，成长记忆已更新。</div>` : renderSubmissionProgress(task)}
  `;

  if (!keepWriting && done) {
    hydrateTaskInputs();
  }

  renderFeedback(feedback);
}

function renderKnowledgeCards(cards) {
  if (!cards.length) return `<p class="muted">今天没有知识点卡片。</p>`;
  return `
    <div class="card-list knowledge-card-list">
      ${cards.map((card) => `
        <article class="knowledge-card">
          <strong>${escapeHtml(card.title)}</strong>
          <p>${escapeHtml(card.body)}</p>
          ${renderCardDetailBlock("详细讲解", card.details || [])}
          ${renderCardDetailBlock("要点归纳", card.takeaways || [])}
          ${card.exampleMethod ? `<h3>例题方法说明</h3><p>${escapeHtml(card.exampleMethod)}</p>` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function renderCardDetailBlock(title, items) {
  if (!items.length) return "";
  return `
    <h3>${escapeHtml(title)}</h3>
    ${renderList(items)}
  `;
}

function renderPractice() {
  const task = getTaskForDate(state.plan, state.selectedDate);
  if (!task?.practiceSet) {
    elements.practicePanel.innerHTML = `<h2>今日练习题</h2><p class="muted">没有可生成的练习题。</p>`;
    return;
  }
  const submission = getTaskSubmission(task);
  const practiceResult = submission.practice?.result || state.lastPracticeResult;
  const resultById = new Map((practiceResult?.results || []).map((result) => [result.questionId, result]));
  const done = isTaskDone(task);
  const canSubmit = arePracticeAnswersComplete(task) && !submission.practice && !done;
  elements.practicePanel.innerHTML = `
    <h2>今日练习题</h2>
    <p class="muted">共 ${task.practiceSet.questions.length} 题。${escapeHtml(task.practiceSet.examplePattern)}</p>
    ${renderExampleFamilies(task.practiceSet.exampleFamilies || [])}
    <div class="practice-list">
      ${task.practiceSet.questions
        .map((question, index) => {
          const result = resultById.get(question.questionId);
          return `
            <label class="practice-question">
              ${question.exampleFamily ? `<em>${escapeHtml(question.exampleFamily)}</em>` : ""}
              <span>${index + 1}. ${escapeHtml(question.prompt)}</span>
              <input class="practice-answer" data-question-id="${question.questionId}" value="${escapeHtml(result?.answer || "")}" placeholder="输入答案" />
              ${
                result
                  ? `<strong class="${result.correct ? "correct" : "incorrect"}">${result.correct ? "正确" : "需订正"}：${escapeHtml(result.explanation)}</strong>`
                  : ""
              }
            </label>
          `;
        })
        .join("")}
    </div>
    <button id="submitPractice" class="primary practice-submit" type="button" ${canSubmit ? "" : "disabled"}>
      ${practiceButtonLabel(task, submission, done)}
    </button>
  `;
  updateSubmitButtonState();
}

function renderSubmissionProgress(task) {
  const submission = getTaskSubmission(task);
  const items = [
    ["练习题", Boolean(submission.practice)],
    ["学习记录", Boolean(submission.learningRecord)],
    ["小发现", Boolean(submission.discovery)]
  ];
  return `
    <div class="submission-progress">
      ${items.map(([label, complete]) => `<span class="${complete ? "complete" : ""}">${complete ? "已提交" : "待提交"} · ${label}</span>`).join("")}
    </div>
  `;
}

function renderExampleFamilies(families) {
  if (!families.length) return "";
  return `
    <div class="example-family-list">
      ${families
        .map((family) => `
          <article>
            <strong>${escapeHtml(family.title)}</strong>
            <p>${escapeHtml(family.method)}</p>
            <span>${family.questionCount} 题</span>
          </article>
        `)
        .join("")}
    </div>
  `;
}

function renderDailySummary() {
  const summary = state.lastSummary;
  if (!summary) {
    elements.dailySummaryPanel.innerHTML = `
      <h2>完成后我会看到什么</h2>
      <p class="muted">提交练习后，这里会告诉你今天掌握得怎么样、哪一步最值得复盘、明天怎么继续。</p>
    `;
    return;
  }

  elements.dailySummaryPanel.innerHTML = `
    <h2>今天的小结</h2>
    <p class="feedback-main">${escapeHtml(summary.mainMessage)}</p>
    <div class="summary-line">${escapeHtml(summary.scoreLine)}</div>
    <h3>下一步这样做</h3>
    ${renderList(summary.nextSteps)}
    <div class="next-action">${escapeHtml(summary.encouragement)}</div>
  `;
}

function renderLearningRecordControls() {
  const task = getTaskForDate(state.plan, state.selectedDate);
  if (!task) return;
  updateSubmitButtonState();
}

function renderFeedback(feedback) {
  if (!state.lastSummary) {
    elements.feedbackPanel.className = "student-feedback-inline";
    elements.feedbackPanel.innerHTML = `
      <strong>学习提示</strong>
      <span>先答完练习题，再提交学习记录，再写一句今天的小发现。提交后，我会帮你整理今天的亮点和下一步。</span>
    `;
    return;
  }

  elements.feedbackPanel.className = "panel student-feedback";
  elements.feedbackPanel.innerHTML = `
    <h2>给你的学习提醒</h2>
    <p class="feedback-main">${escapeHtml(toStudentMessage(feedback.mainMessage))}</p>
    <div class="feedback-columns student-feedback-grid">
      <div>
        <h3>你已经做得不错的地方</h3>
        ${renderList(feedback.strengths)}
      </div>
      <div>
        <h3>接下来试试</h3>
        ${renderList(feedback.improvements)}
      </div>
    </div>
    <div class="next-action">${escapeHtml(feedback.nextAction)}</div>
  `;
}

function toStudentMessage(message) {
  return String(message || "")
    .replaceAll("学习证据", "你的解题记录")
    .replaceAll("反馈", "提醒");
}

function renderMemory() {
  const memory = state.memory;
  elements.memoryPanel.innerHTML = `
    <div class="memory-stat"><strong>${memory.progress.currentStreakDays}</strong><span>连续天数</span></div>
    <div class="memory-stat"><strong>${memory.progress.longestStreakDays}</strong><span>最长连续</span></div>
    <div class="memory-stat"><strong>${memory.progress.evidenceWords}</strong><span>证据字数</span></div>
    <div class="memory-full">
      <h3>学习习惯画像</h3>
      <p>激励风格：${labelMotivation(memory.preferences.motivationStyle)}</p>
      <p>任务偏好：${escapeHtml(memory.preferences.preferredTaskSize || "25 分钟小任务")}</p>
      <p>下一目标：${escapeHtml(memory.next_goal)}</p>
    </div>
    <div>
      <h3>优势记忆</h3>
      ${renderList(memory.strengths.length ? memory.strengths : ["完成任务后会逐步形成优势记忆。"])}
    </div>
    <div>
      <h3>待强化点</h3>
      ${renderList(memory.weaknesses.length ? memory.weaknesses : ["暂无明显待强化点。"])}
    </div>
  `;
}

function renderTimeline() {
  if (!state.memory.events.length) {
    elements.timeline.innerHTML = `<p class="muted">还没有学习记录。完成今日任务后，这里会出现成长记忆事件。</p>`;
    return;
  }
  elements.timeline.innerHTML = state.memory.events
    .slice()
    .reverse()
    .map(
      (event) => `
        <article class="timeline-item">
          <span>${event.createdAt.slice(0, 10)}</span>
          <p>${escapeHtml(event.summary)}</p>
        </article>
      `
    )
    .join("");
}

function chooseDefaultSelectedDate() {
  const exact = state.plan.tasks.find((task) => task.date === state.today);
  return exact?.date || state.plan.tasks[0]?.date || state.settings.startDate;
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function collectPracticeAnswers() {
  return Array.from(document.querySelectorAll(".practice-answer")).reduce((answers, input) => {
    answers[input.dataset.questionId] = input.value;
    return answers;
  }, {});
}

function arePracticeAnswersComplete(task = getTaskForDate(state.plan, state.selectedDate)) {
  if (!task?.practiceSet?.questions?.length) return false;
  const answers = collectPracticeAnswers();
  return task.practiceSet.questions.every((question) => String(answers[question.questionId] || "").trim().length > 0);
}

function updateSubmitButtonState() {
  const task = getTaskForDate(state.plan, state.selectedDate);
  if (!task) return;
  const submission = getTaskSubmission(task);
  const done = isTaskDone(task);
  const practiceButton = document.querySelector("#submitPractice");
  if (practiceButton) {
    practiceButton.disabled = done || Boolean(submission.practice) || !arePracticeAnswersComplete(task);
    practiceButton.textContent = practiceButtonLabel(task, submission, done);
  }
  const recordButton = document.querySelector("#submitLearningRecord");
  if (recordButton) {
    recordButton.disabled = done || Boolean(submission.learningRecord) || !elements.evidence.value.trim();
    recordButton.textContent = learningRecordButtonLabel(submission, done);
  }
  const discoveryButton = document.querySelector("#submitDiscovery");
  if (discoveryButton) {
    discoveryButton.disabled = done || Boolean(submission.discovery) || !elements.reflection.value.trim();
    discoveryButton.textContent = discoveryButtonLabel(submission, done);
  }
}

function practiceButtonLabel(task, submission, done) {
  if (done || submission.practice) return "练习题已提交";
  return arePracticeAnswersComplete(task) ? "提交练习题" : "答完练习题后提交";
}

function learningRecordButtonLabel(submission, done) {
  if (done || submission.learningRecord) return "学习记录已提交";
  return elements.evidence.value.trim() ? "提交学习记录" : "先上传并整理学习记录";
}

function discoveryButtonLabel(submission, done) {
  if (done || submission.discovery) return "小发现已提交";
  return elements.reflection.value.trim() ? "提交今天的小发现" : "写完今天的小发现后提交";
}

function getTaskSubmission(task = getTaskForDate(state.plan, state.selectedDate)) {
  if (!task) return {};
  if (!state.dailySubmissions[task.taskId]) state.dailySubmissions[task.taskId] = {};
  return state.dailySubmissions[task.taskId];
}

function persistDailySubmissions() {
  localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(state.dailySubmissions));
}

function restoreDailySubmissions(value) {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function isTaskDone(task = getTaskForDate(state.plan, state.selectedDate)) {
  return Boolean(task && state.memory.events.some((event) => event.sourceId === task.taskId));
}

function hydrateTaskInputs() {
  const task = getTaskForDate(state.plan, state.selectedDate);
  if (!task) return;
  if (state.hydratedTaskId === task.taskId) return;
  const submission = getTaskSubmission(task);
  elements.evidence.value = submission.learningRecord?.text || "";
  elements.reflection.value = submission.discovery?.text || "";
  state.hydratedTaskId = task.taskId;
}

function formatDisplayDate(dateIso) {
  const date = new Date(`${dateIso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateIso || "-";
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function labelMotivation(style) {
  return {
    achievement_oriented: "成就记录型",
    gentle_companion: "温和陪伴型",
    goal_oriented: "目标导向型",
    curiosity_driven: "好奇探索型",
    resilience_support: "小步恢复型"
  }[style] || "温和陪伴型";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();

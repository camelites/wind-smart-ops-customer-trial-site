export const DEFAULT_BOOK = {
  title: "数学思维（原书第7版）",
  originalTitle: "Thinking Mathematically, Seventh Edition",
  author: "Robert Blitzer",
  domainId: "math_thinking",
  toc: [
    "第一章：解决问题与批判性思维",
    "1.1 归纳推理与演绎推理",
    "1.2 估算、图表与数学模型",
    "1.3 解决问题",
    "第二章：集合论",
    "2.1 基本的集合概念",
    "2.2 子集",
    "2.3 韦恩图和集合运算",
    "2.4 三个集合的集合运算与韦恩图",
    "2.5 调查问题",
    "第三章：逻辑",
    "3.1 命题、否定与量化命题",
    "3.2 复合命题和联结词",
    "3.3 非运算、且运算和或运算的真值表",
    "3.4 条件命题和双重条件命题的真值表",
    "3.5 等价命题与条件命题的变体",
    "3.6 条件命题的否定与德·摩根律",
    "3.7 论证与真值表",
    "3.8 论证与欧拉图",
    "第四章：数字表示法及计算",
    "4.1 印度-阿拉伯计数系统和早期位值系统",
    "4.2 位值系统的基数",
    "4.3 位值系统中的计算",
    "4.4 回顾早期的计数系统",
    "第五章：数论与实数系统",
    "5.1 数论：质数与合数",
    "5.2 整数及其运算",
    "5.3 有理数"
  ]
};

export const DEFAULT_SETTINGS = {
  startDate: "2026-07-04",
  endDate: "2026-08-31",
  dailyMinutes: 25,
  includeWeekends: true,
  learnerName: "同学",
  goal: "暑假建立数学思维学习习惯，每天完成一个小任务。"
};

export const EMPTY_MEMORY = {
  goal: DEFAULT_SETTINGS.goal,
  preferences: {
    motivationStyle: "gentle_companion",
    bestStudyTime: "未观察",
    preferredTaskSize: "25 分钟小任务"
  },
  weaknesses: [],
  strengths: [],
  progress: {
    completedTasks: 0,
    currentStreakDays: 0,
    longestStreakDays: 0,
    evidenceWords: 0,
    practiceAccuracy: 0
  },
  next_goal: "完成今天的一个小任务，并写下自己的解题证据。",
  events: []
};

export function parseTocText(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => /[\p{L}\p{N}]/u.test(line))
    .map((line, index) => ({
      unitId: `unit-${index + 1}`,
      title: line.replace(/^第[一二三四五六七八九十百\d]+章\s*[：:]\s*/, "").trim(),
      order: index + 1
    }));
}

export function enumerateStudyDates(startDate, endDate, includeWeekends = true) {
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);
  if (!start || !end || start.getTime() > end.getTime()) return [];

  const dates = [];
  for (let time = start.getTime(); time <= end.getTime(); time += 86400000) {
    const date = new Date(time);
    const day = date.getUTCDay();
    if (includeWeekends || (day !== 0 && day !== 6)) {
      dates.push(date.toISOString().slice(0, 10));
    }
  }
  return dates;
}

export function generateSummerPlan({ book = DEFAULT_BOOK, settings = DEFAULT_SETTINGS, memory = EMPTY_MEMORY, contentProfile = null } = {}) {
  const contentUnits = normalizeContentUnits(contentProfile?.units);
  const tocItems = contentUnits.length ? contentUnits : parseTocText(book.toc.join("\n"));
  const dates = enumerateStudyDates(settings.startDate, settings.endDate, settings.includeWeekends);
  const taskCount = Math.min(tocItems.length, dates.length);
  const tasks = Array.from({ length: taskCount }, (_, index) => {
    const unit = tocItems[index];
    return buildDailyTask({
      date: dates[index],
      index,
      unit,
      book,
      dailyMinutes: settings.dailyMinutes,
      memory,
      contentUnit: contentUnits[index] || null
    });
  });

  return {
    planId: `math-thinking-summer-${settings.startDate}-${settings.endDate}`,
    book: {
      title: book.title,
      author: book.author,
      domainId: book.domainId
    },
    dates,
    tasks,
    warnings: buildPlanWarnings(tocItems, dates, Boolean(contentUnits.length), contentProfile?.warnings || [])
  };
}

export function getTaskForDate(plan, dateIso) {
  if (!plan?.tasks?.length) return null;
  const exact = plan.tasks.find((task) => task.date === dateIso);
  if (exact) return exact;

  const firstOpen = plan.tasks.find((task) => task.date > dateIso);
  return firstOpen || plan.tasks[plan.tasks.length - 1];
}

export function generatePracticeSet(task) {
  if (!task) throw new Error("task is required");
  const template = practiceTemplateForTask(task);
  return {
    setId: `${task.taskId}-practice`,
    taskId: task.taskId,
    knowledgePoint: task.focus,
    examplePattern: template.examplePattern,
    exampleFamilies: template.exampleFamilies || [],
    questions: template.questions.map((question, index) => ({
      ...question,
      questionId: `${task.taskId}-q${index + 1}`
    })),
    boundary: "练习题为系统按当天知识点原创生成，用于检验掌握情况；不复制书中例题或原文。"
  };
}

export function evaluatePracticeAnswers(practiceSet, answers = {}) {
  if (!practiceSet?.questions?.length) {
    return {
      total: 0,
      correct: 0,
      accuracy: 0,
      results: [],
      mastered: false,
      weakKnowledgePoints: ["今日练习题为空，请先生成练习。"]
    };
  }

  const results = practiceSet.questions.map((question) => {
    const answer = normalizeAnswer(answers[question.questionId]);
    const accepted = question.acceptedAnswers.map(normalizeAnswer);
    const matched = question.checkMode === "keywords"
      ? accepted.every((item) => answer.includes(item))
      : question.checkMode === "any_keyword"
        ? accepted.some((item) => answer.includes(item))
        : accepted.some((item) => answer === item || answer.includes(item));
    return {
      questionId: question.questionId,
      prompt: question.prompt,
      answer,
      correct: matched,
      expectedAnswer: question.acceptedAnswers[0],
      explanation: question.explanation,
      knowledgePoint: question.knowledgePoint
    };
  });
  const correct = results.filter((result) => result.correct).length;
  const accuracy = Math.round((correct / results.length) * 100);
  return {
    total: results.length,
    correct,
    accuracy,
    results,
    mastered: accuracy >= 80,
    weakKnowledgePoints: [...new Set(results.filter((result) => !result.correct).map((result) => result.knowledgePoint))]
  };
}

export function buildDailySummary({ task, practiceResult, evidence = "", reflection = "", memory = EMPTY_MEMORY }) {
  const cleanEvidence = normalizeStudentText(evidence);
  const cleanReflection = normalizeStudentText(reflection);
  const accuracy = practiceResult?.accuracy ?? 0;
  const mastered = Boolean(practiceResult?.mastered);
  const weakPoints = practiceResult?.weakKnowledgePoints ?? [];
  const evidenceReady = cleanEvidence.length >= 20 || cleanReflection.length >= 8;
  const mainMessage = mastered
    ? `今天对“${task.unitTitle}”的练习掌握较稳，正确率 ${accuracy}%。`
    : `今天“${task.unitTitle}”还需要补强，练习正确率 ${accuracy}%。`;
  const nextSteps = [];

  if (!mastered) {
    nextSteps.push(`先复盘：${weakPoints[0] || task.focus}。`);
    nextSteps.push("重做错题，只写“条件 -> 步骤 -> 检查”三行。");
  } else {
    nextSteps.push("明天进入下一节前，用 2 分钟口头复述今天的方法。");
  }
  if (!evidenceReady) nextSteps.push("补充一条学习记录或今天的小发现，让成长记忆更可靠。");
  if (memory.progress?.currentStreakDays >= 2) nextSteps.push(`保持连续学习 ${memory.progress.currentStreakDays} 天的节奏。`);

  return {
    mainMessage,
    scoreLine: `${practiceResult?.correct ?? 0}/${practiceResult?.total ?? 0} 题正确`,
    mastered,
    weakPoints,
    nextSteps,
    encouragement: mastered ? "不错，今天不是只看懂了，而是经受住了小测。" : "没关系，错题已经把下一步该练哪里指出来了。"
  };
}

export function completeTask({
  memory = EMPTY_MEMORY,
  task,
  evidence = "",
  reflection = "",
  practiceResult,
  completedAt = new Date().toISOString()
}) {
  if (!task) throw new Error("task is required");
  const cleanEvidence = normalizeStudentText(evidence);
  const cleanReflection = normalizeStudentText(reflection);
  const eventDate = completedAt.slice(0, 10);
  const previousEvents = Array.isArray(memory.events) ? memory.events : [];
  const practiceAccuracy = Number.isFinite(practiceResult?.accuracy) ? practiceResult.accuracy : null;
  const weakKnowledgePoints = Array.isArray(practiceResult?.weakKnowledgePoints) ? practiceResult.weakKnowledgePoints : [];
  const event = {
    id: `memory-${eventDate}-${task.taskId}`,
    memoryType: "practice_session",
    sourceType: "student_evidence",
    sourceId: task.taskId,
    confidence: cleanEvidence.length >= 20 && practiceAccuracy !== null ? "high" : "medium",
    summary: buildEventSummary(task, cleanEvidence, cleanReflection, practiceResult),
    evidence: {
      taskTitle: task.unitTitle,
      evidenceLength: cleanEvidence.length,
      reflectionLength: cleanReflection.length,
      reasoningSignals: inferReasoningSignals(cleanEvidence, cleanReflection),
      practiceAccuracy,
      weakKnowledgePoints
    },
    createdAt: completedAt,
    usableForContext: true,
    archived: false
  };
  const events = upsertEvent(previousEvents, event);
  const progress = buildProgress(events);
  const signals = collectSignals(events);
  const motivationStyle = inferMotivationStyle(progress, signals, memory.preferences?.motivationStyle);

  return {
    goal: memory.goal || DEFAULT_SETTINGS.goal,
    preferences: {
      ...memory.preferences,
      motivationStyle,
      preferredTaskSize: task.estimatedMinutes <= 25 ? "25 分钟小任务" : "较长任务需拆分"
    },
    weaknesses: signals.weaknesses,
    strengths: signals.strengths,
    progress,
    next_goal: chooseNextGoal(signals, task),
    events
  };
}

export function buildFeedback({ task, evidence = "", reflection = "", memory = EMPTY_MEMORY, completed = false }) {
  const cleanEvidence = normalizeStudentText(evidence);
  const cleanReflection = normalizeStudentText(reflection);
  const signals = inferReasoningSignals(cleanEvidence, cleanReflection);
  const style = memory.preferences?.motivationStyle || "gentle_companion";
  const mainMessage = completed
    ? encouragementForStyle(style, memory.progress?.currentStreakDays || 0)
    : "先答完练习题，再写一句今天的小发现；有笔记或解题照片也可以上传。";

  const strengths = [];
  const improvements = [];
  if (signals.includes("step_reasoning")) strengths.push("你开始记录解题步骤，后面复盘会更容易。");
  if (signals.includes("error_checking")) strengths.push("你有检查错误或边界条件的意识。");
  if (signals.includes("modeling")) strengths.push("你在尝试把文字、图表或条件转成数学表示。");
  if (cleanEvidence.length < 20 && cleanReflection.length < 8) improvements.push("补一句今天的小发现：哪一步最容易错，或者你检查了什么。");
  if (!signals.includes("error_checking")) improvements.push("补一个检查动作：答案是否合理、有没有漏掉条件。");
  if (!cleanReflection) improvements.push("写一句今天的小发现：今天最卡的一步是什么。");

  return {
    mainMessage,
    strengths: strengths.length ? strengths : ["今天愿意开始就是有效进展。"],
    improvements: improvements.length ? improvements : ["下一步保持同样节奏，再把依据写得更清楚。"],
    nextAction: chooseNextGoal({ strengths, weaknesses: improvements }, task),
    boundary: "反馈只基于学生自写证据和任务元数据，不读取或验证书籍原文。"
  };
}

export function sanitizePersistencePayload(value) {
  return JSON.stringify(value);
}

export function restoreMemory(value) {
  if (!value) return clone(EMPTY_MEMORY);
  try {
    const parsed = JSON.parse(value);
    return {
      ...clone(EMPTY_MEMORY),
      ...parsed,
      preferences: { ...EMPTY_MEMORY.preferences, ...(parsed.preferences || {}) },
      progress: { ...EMPTY_MEMORY.progress, ...(parsed.progress || {}) },
      events: Array.isArray(parsed.events) ? parsed.events : []
    };
  } catch {
    return clone(EMPTY_MEMORY);
  }
}

function buildDailyTask({ date, index, unit, book, dailyMinutes, memory, contentUnit = null }) {
  const focus = focusForTitle(unit.title, index);
  const nextGoal = memory.next_goal || EMPTY_MEMORY.next_goal;
  const knowledgeCards = buildKnowledgeCards(unit, focus, contentUnit);
  const keyTakeaways = buildKeyTakeaways(unit, focus, contentUnit);
  const task = {
    taskId: `${book.domainId}-${unit.unitId}-${date}`,
    date,
    unitId: unit.unitId,
    unitTitle: unit.title,
    estimatedMinutes: dailyMinutes,
    focus,
    knowledgeCards,
    keyTakeaways,
    contentKeywords: contentUnit?.keywords || [],
    contentSummary: contentUnit?.summary || "",
    contentExamplePattern: contentUnit?.examplePattern || "",
    contentExampleFamilies: contentUnit?.exampleFamilies || [],
    contentPracticeQuestions: contentUnit?.practiceQuestions || [],
    prompt: `学习 ${unit.title}：用自己的话记录一个关键概念、一个推理步骤和一个检查点。`,
    evidencePrompt: "请写学生自创证据：解题步骤、错因说明、图表观察或一句自己的总结。不要复制书籍原文。",
    reflectionPrompt: "今天最容易出错或最值得检查的一步是什么？",
    adaptiveHint: nextGoal
  };
  return {
    ...task,
    practiceSet: generatePracticeSet(task)
  };
}

function buildPlanWarnings(tocItems, dates, usesPdfContent = false, upstreamWarnings = []) {
  const warnings = [...upstreamWarnings];
  if (!tocItems.length) warnings.push("目录为空，无法生成每日任务。");
  if (dates.length < tocItems.length) warnings.push("暑假日期少于章节数，只安排前面可覆盖的章节。");
  if (usesPdfContent) {
    warnings.push("已使用本地 PDF 抽取结果生成计划；页面只展示短摘要、关键词和原创练习题。");
  } else {
    warnings.push("未解析 PDF 正文；计划只基于书名、作者和目录标题。");
  }
  return warnings;
}

function parseIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

function normalizeStudentText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function buildEventSummary(task, evidence, reflection, practiceResult) {
  const evidenceSummary = evidence ? `证据 ${evidence.length} 字` : "未写证据";
  const reflectionSummary = reflection ? `反思 ${reflection.length} 字` : "未写反思";
  const practiceSummary = practiceResult ? `练习 ${practiceResult.correct}/${practiceResult.total} 题正确` : "未记录练习结果";
  return `${task.unitTitle} 已完成：${practiceSummary}，${evidenceSummary}，${reflectionSummary}。`;
}

function upsertEvent(events, event) {
  return [...events.filter((item) => item.id !== event.id), event].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function buildProgress(events) {
  const completedDates = [...new Set(events.map((event) => event.createdAt.slice(0, 10)))].sort();
  const currentStreakDays = countCurrentStreak(completedDates);
  return {
    completedTasks: events.length,
    currentStreakDays,
    longestStreakDays: countLongestStreak(completedDates),
    evidenceWords: events.reduce((sum, event) => sum + Number(event.evidence?.evidenceLength || 0), 0),
    practiceAccuracy: averagePracticeAccuracy(events)
  };
}

function averagePracticeAccuracy(events) {
  const values = events
    .map((event) => event.evidence?.practiceAccuracy)
    .filter((value) => Number.isFinite(value));
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function countCurrentStreak(dates) {
  if (!dates.length) return 0;
  let streak = 1;
  for (let index = dates.length - 1; index > 0; index -= 1) {
    if (daysBetween(dates[index - 1], dates[index]) === 1) streak += 1;
    else break;
  }
  return streak;
}

function countLongestStreak(dates) {
  if (!dates.length) return 0;
  let best = 1;
  let current = 1;
  for (let index = 1; index < dates.length; index += 1) {
    if (daysBetween(dates[index - 1], dates[index]) === 1) current += 1;
    else current = 1;
    best = Math.max(best, current);
  }
  return best;
}

function daysBetween(left, right) {
  return Math.round((parseIsoDate(right).getTime() - parseIsoDate(left).getTime()) / 86400000);
}

function collectSignals(events) {
  const allSignals = events.flatMap((event) => event.evidence?.reasoningSignals || []);
  const weakKnowledgePoints = events.flatMap((event) => event.evidence?.weakKnowledgePoints || []);
  const strengths = [];
  const weaknesses = [];
  if (allSignals.includes("step_reasoning")) strengths.push("愿意写出步骤依据");
  if (allSignals.includes("error_checking")) strengths.push("有检查答案和条件的意识");
  if (allSignals.includes("modeling")) strengths.push("能把问题转成图表、算式或模型");
  if (events.some((event) => Number(event.evidence?.practiceAccuracy) >= 80)) strengths.push("练习题掌握度较稳");
  if (!allSignals.includes("error_checking")) weaknesses.push("需要补上答案合理性检查");
  if (!allSignals.includes("step_reasoning")) weaknesses.push("需要把推理步骤写完整");
  for (const point of weakKnowledgePoints) {
    if (point && !weaknesses.includes(point)) weaknesses.push(point);
  }
  return { strengths, weaknesses };
}

function inferReasoningSignals(evidence, reflection) {
  const text = `${evidence} ${reflection}`;
  const signals = [];
  if (/步骤|因为|所以|推出|依据|条件|先|再/.test(text)) signals.push("step_reasoning");
  if (/检查|错误|错因|合理|边界|漏掉|验证/.test(text)) signals.push("error_checking");
  if (/图|表|模型|估算|分类|集合|逻辑|真值|韦恩|数轴|算式/.test(text)) signals.push("modeling");
  return signals;
}

function inferMotivationStyle(progress, signals, previousStyle = "gentle_companion") {
  if (progress.currentStreakDays >= 5) return "achievement_oriented";
  if (signals.weaknesses.length >= 2 && progress.completedTasks <= 2) return "resilience_support";
  if (signals.strengths.includes("能把问题转成图表、算式或模型")) return "curiosity_driven";
  return previousStyle;
}

function chooseNextGoal(signals, task) {
  const weaknesses = signals.weaknesses || [];
  if (weaknesses.some((item) => item.includes("检查") || item.includes("合理性"))) {
    return "下次完成后先做一个答案合理性检查。";
  }
  if (weaknesses.some((item) => item.includes("步骤") || item.includes("证据"))) {
    return "下次把“条件 -> 步骤 -> 结论”写完整。";
  }
  return `下次继续学习 ${task?.unitTitle || "下一节"}，保留一个推理证据。`;
}

function focusForTitle(title, index) {
  if (/集合|韦恩/.test(title)) return "分类、关系和图示表达";
  if (/逻辑|命题|真值|论证/.test(title)) return "条件判断和推理链";
  if (/估算|模型|图表/.test(title)) return "估算、建模和信息转换";
  if (/数论|质数|整数|有理数/.test(title)) return "数的结构和运算依据";
  if (index === 0) return "解决问题的整体策略";
  return "概念理解、步骤表达和检查习惯";
}

function practiceTemplateForTask(task) {
  if (Array.isArray(task.contentExampleFamilies) && task.contentExampleFamilies.length) {
    const families = task.contentExampleFamilies
      .map((family) => ({
        title: String(family.title || "").trim(),
        method: String(family.method || "").trim(),
        sourceConnection: String(family.sourceConnection || "").trim(),
        questions: Array.isArray(family.questions) ? family.questions : []
      }))
      .filter((family) => family.title && family.questions.length);
    const questions = families.flatMap((family) =>
      family.questions.map((question) => ({
        ...question,
        exampleFamily: family.title,
        sourceConnection: family.sourceConnection
      }))
    );
    return {
      examplePattern: families.map((family) => `${family.title}：${family.method}`).join("；"),
      exampleFamilies: families.map((family) => ({
        title: family.title,
        method: family.method,
        sourceConnection: family.sourceConnection,
        questionCount: family.questions.length
      })),
      questions
    };
  }

  if (Array.isArray(task.contentPracticeQuestions) && task.contentPracticeQuestions.length) {
    return {
      examplePattern: task.contentExamplePattern || "例题方法：先确认定义和条件，再写步骤并检查答案。",
      questions: task.contentPracticeQuestions
    };
  }

  if (Array.isArray(task.contentKeywords) && task.contentKeywords.length >= 2) {
    const first = task.contentKeywords[0];
    const second = task.contentKeywords[1];
    const third = task.contentKeywords[2] || task.focus;
    return {
      examplePattern: `例题类型：围绕“${first} / ${second}”识别概念、写出依据，并检查适用条件。`,
      questions: [
        {
          type: "short_text",
          prompt: `根据今天的内容，写出一个核心关键词。`,
          acceptedAnswers: [first, second, third],
          checkMode: "any_keyword",
          explanation: `本节抽取到的关键词包括：${task.contentKeywords.slice(0, 4).join("、")}。`,
          knowledgePoint: first
        },
        {
          type: "short_text",
          prompt: `如果一道题涉及“${first}”，解题时第一步应该先确认什么？`,
          acceptedAnswers: ["条件", "定义", first],
          checkMode: "any_keyword",
          explanation: "先确认定义、条件和适用范围，再进入计算或推理。",
          knowledgePoint: "条件识别"
        },
        {
          type: "short_text",
          prompt: `学完“${second}”后，最后一步至少要检查什么？`,
          acceptedAnswers: ["合理", "条件", "单位", "定义"],
          checkMode: "any_keyword",
          explanation: "检查答案是否合理、条件是否用全、定义是否用对。",
          knowledgePoint: "掌握检查"
        }
      ]
    };
  }

  const title = task.unitTitle;
  if (/集合|子集|韦恩/.test(title)) {
    return {
      examplePattern: "例题类型：把对象分类到集合，判断交集、并集或子集关系。",
      questions: [
        {
          type: "short_text",
          prompt: "A={2,4,6,8}，B={1,2,3,4}。A∩B 是什么？",
          acceptedAnswers: ["{2,4}", "2,4"],
          checkMode: "exact",
          explanation: "交集只保留两个集合共有的元素，所以是 {2,4}。",
          knowledgePoint: "交集"
        },
        {
          type: "short_text",
          prompt: "如果 C={正方形, 长方形}，D={四边形}，C 是 D 的子集吗？回答“是”或“否”。",
          acceptedAnswers: ["是"],
          checkMode: "exact",
          explanation: "正方形和长方形都属于四边形，所以 C 是 D 的子集。",
          knowledgePoint: "子集关系"
        },
        {
          type: "short_text",
          prompt: "做集合题时，最后一步最应该检查什么？写出关键词。",
          acceptedAnswers: ["有没有漏掉", "重复", "元素"],
          checkMode: "keywords",
          explanation: "集合题要检查元素是否漏掉、重复或放错区域。",
          knowledgePoint: "集合检查"
        }
      ]
    };
  }

  if (/逻辑|命题|真值|论证|条件/.test(title)) {
    return {
      examplePattern: "例题类型：判断命题真假，写出条件关系，再检查反例。",
      questions: [
        {
          type: "short_text",
          prompt: "命题“所有偶数都能被 2 整除”是真还是假？",
          acceptedAnswers: ["真"],
          checkMode: "exact",
          explanation: "偶数定义就是能被 2 整除的整数。",
          knowledgePoint: "命题真假"
        },
        {
          type: "short_text",
          prompt: "“如果下雨，那么地面会湿”中，“下雨”是条件还是结论？",
          acceptedAnswers: ["条件"],
          checkMode: "exact",
          explanation: "如果 P 那么 Q 中，P 是条件，Q 是结论。",
          knowledgePoint: "条件命题"
        },
        {
          type: "short_text",
          prompt: "检验一个“所有……”命题时，可以尝试找什么？",
          acceptedAnswers: ["反例"],
          checkMode: "exact",
          explanation: "一个反例就能推翻全称命题。",
          knowledgePoint: "反例检查"
        }
      ]
    };
  }

  if (/估算|模型|图表/.test(title)) {
    return {
      examplePattern: "例题类型：先估算数量级，再用图表或模型检查答案是否合理。",
      questions: [
        {
          type: "short_text",
          prompt: "估算 198×5，最接近的是 1000 还是 1500？",
          acceptedAnswers: ["1000"],
          checkMode: "exact",
          explanation: "198 接近 200，200×5=1000。",
          knowledgePoint: "估算"
        },
        {
          type: "short_text",
          prompt: "把“每天读 25 分钟，4 天共多少分钟”建成算式。",
          acceptedAnswers: ["25×4", "4×25", "25*4", "4*25"],
          checkMode: "exact",
          explanation: "每天 25 分钟，4 天就是 25×4。",
          knowledgePoint: "数学模型"
        },
        {
          type: "short_text",
          prompt: "建模后要检查答案的什么？写出一个关键词。",
          acceptedAnswers: ["单位", "合理"],
          checkMode: "keywords",
          explanation: "建模后要检查单位和答案是否合理。",
          knowledgePoint: "合理性检查"
        }
      ]
    };
  }

  if (/数论|质数|合数|整数|有理数/.test(title)) {
    return {
      examplePattern: "例题类型：根据定义分类数字，并说明运算依据。",
      questions: [
        {
          type: "short_text",
          prompt: "17 是质数还是合数？",
          acceptedAnswers: ["质数"],
          checkMode: "exact",
          explanation: "17 只有 1 和 17 两个正因数。",
          knowledgePoint: "质数与合数"
        },
        {
          type: "short_text",
          prompt: "-3+5 的结果是多少？",
          acceptedAnswers: ["2"],
          checkMode: "exact",
          explanation: "从 -3 向右移动 5 个单位到 2。",
          knowledgePoint: "整数运算"
        },
        {
          type: "short_text",
          prompt: "1/2 是有理数吗？回答“是”或“否”。",
          acceptedAnswers: ["是"],
          checkMode: "exact",
          explanation: "能写成两个整数之比的数是有理数。",
          knowledgePoint: "有理数"
        }
      ]
    };
  }

  return {
    examplePattern: "例题类型：读题后列条件，写步骤，最后检查答案是否合理。",
    questions: [
      {
        type: "short_text",
        prompt: "解决问题时，第一步通常先找什么？",
        acceptedAnswers: ["条件", "已知条件"],
        checkMode: "exact",
        explanation: "先找已知条件，才能决定使用什么方法。",
        knowledgePoint: "条件识别"
      },
      {
        type: "short_text",
        prompt: "如果一种方法失败，下一步应该直接猜答案，还是换一种表示方法？",
        acceptedAnswers: ["换一种表示方法", "换表示方法"],
        checkMode: "exact",
        explanation: "换图表、算式或分类方式，能帮助重新组织信息。",
        knowledgePoint: "问题表征"
      },
      {
        type: "short_text",
        prompt: "完成后至少要检查什么？写出一个关键词。",
        acceptedAnswers: ["合理", "条件"],
        checkMode: "keywords",
        explanation: "检查答案是否合理，以及是否用到了所有重要条件。",
        knowledgePoint: "答案检查"
      }
    ]
  };
}

function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[，。；;、]/g, ",")
    .replace(/[（）]/g, (mark) => (mark === "（" ? "(" : ")"));
}

function normalizeContentUnits(units) {
  if (!Array.isArray(units)) return [];
  return units
    .map((unit, index) => {
      const title = String(unit?.title || "").trim();
      if (!title) return null;
      return {
        unitId: unit.unitId || `pdf-unit-${index + 1}`,
        title,
        order: index + 1,
        summary: String(unit.summary || "").trim(),
        keywords: Array.isArray(unit.keywords) ? unit.keywords.map((item) => String(item).trim()).filter(Boolean).slice(0, 8) : [],
        knowledgeCards: Array.isArray(unit.knowledgeCards) ? unit.knowledgeCards : [],
        keyTakeaways: Array.isArray(unit.keyTakeaways) ? unit.keyTakeaways : [],
        examplePattern: String(unit.examplePattern || "").trim(),
        exampleFamilies: Array.isArray(unit.exampleFamilies) ? unit.exampleFamilies : [],
        practiceQuestions: Array.isArray(unit.practiceQuestions) ? unit.practiceQuestions : [],
        sourcePageStart: unit.sourcePageStart || null,
        sourcePageEnd: unit.sourcePageEnd || null
      };
    })
    .filter(Boolean);
}

function buildKnowledgeCards(unit, focus, contentUnit) {
  if (Array.isArray(contentUnit?.knowledgeCards) && contentUnit.knowledgeCards.length) {
    return contentUnit.knowledgeCards.slice(0, 4).map(normalizeKnowledgeCard).filter((card) => card.title && card.body);
  }
  const keywords = contentUnit?.keywords || [];
  if (keywords.length) {
    return keywords.slice(0, 4).map((keyword, index) => ({
      title: keyword,
      body: index === 0
        ? `把“${keyword}”当作本节入口概念：先说清定义或条件，再进入例题方法。`
        : `遇到“${keyword}”相关题目时，记录它和其他条件的关系。`,
      details: [
        `先用自己的话解释“${keyword}”在题目中指什么，再标出它对应的条件或对象。`,
        "遇到例题时不要急着套答案，先拆成“已知条件、要判断的关系、检查方式”三步。"
      ],
      takeaways: ["定义先行", "条件逐项核对", "答案回到题意检查"],
      exampleMethod: `看含有“${keyword}”的例题时，先模仿它的判断顺序，再换一组数字或对象重新练一遍。`
    }));
  }
  return [
    {
      title: focus,
      body: "先把概念、条件和目标分开写，避免直接套答案。",
      details: ["把题目中出现的对象、条件和要求分别圈出来，再决定应该使用哪个概念。"],
      takeaways: ["概念、条件、目标分开写", "每一步都能说出理由"],
      exampleMethod: "例题学习时先遮住答案，口头说出第一步为什么这样做，再对照方法说明修正。"
    },
    {
      title: "例题方法",
      body: "看例题时记录“为什么这样做”，不是只记最后答案。",
      details: ["例题的价值在于展示判断顺序：先识别题型，再选择方法，最后检查结果。"],
      takeaways: ["记录方法，不背答案", "把例题改编成自己的练习"],
      exampleMethod: "把例题改一个条件后重做，若还能按同样方法完成，说明真正掌握了方法。"
    },
    {
      title: "检查点",
      body: "完成后检查条件是否用全、答案是否合理。",
      details: ["检查时回到题目原条件，确认没有漏用限制，也没有把不符合条件的对象放进答案。"],
      takeaways: ["条件用全", "答案合理", "能解释原因"],
      exampleMethod: "例题订正时用“错因 -> 正确规则 -> 下次检查点”三行记录。"
    }
  ];
}

function normalizeKnowledgeCard(card) {
  return {
    title: String(card?.title || "").trim(),
    body: String(card?.body || "").trim(),
    details: normalizeTextList(card?.details || card?.detail || card?.explanation).slice(0, 4),
    takeaways: normalizeTextList(card?.takeaways || card?.keyTakeaways).slice(0, 5),
    exampleMethod: String(card?.exampleMethod || card?.method || "").trim()
  };
}

function normalizeTextList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  const text = String(value || "").trim();
  return text ? [text] : [];
}

function buildKeyTakeaways(unit, focus, contentUnit) {
  if (Array.isArray(contentUnit?.keyTakeaways) && contentUnit.keyTakeaways.length) {
    return contentUnit.keyTakeaways.map((item) => String(item).trim()).filter(Boolean).slice(0, 4);
  }
  const keywords = contentUnit?.keywords || [];
  const summary = contentUnit?.summary;
  const takeaways = [];
  if (summary) takeaways.push(summary);
  if (keywords.length) {
    takeaways.push(`本节关键词：${keywords.slice(0, 5).join("、")}。`);
    takeaways.push(`练习时用“定义/条件 -> 步骤 -> 检查”复盘 ${keywords[0]} 相关例题。`);
  } else {
    takeaways.push(`本节重点是${focus}。`);
    takeaways.push("例题学习要抓方法：条件是什么、用了哪一步、答案怎么检查。");
  }
  return takeaways.slice(0, 3);
}

function encouragementForStyle(style, streakDays) {
  if (style === "achievement_oriented") return `完成了，连续学习 ${Math.max(1, streakDays)} 天，记录在增长。`;
  if (style === "curiosity_driven") return "今天又多探索了一种数学想法，经验库变厚了。";
  if (style === "resilience_support") return "今天先完成一个小任务，这就是重新进入节奏。";
  if (style === "goal_oriented") return "这次任务在积累真正影响数学思维的动作。";
  return "今天完成一个小任务就很好，我们稳稳往前走。";
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

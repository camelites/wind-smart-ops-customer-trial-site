import { MATH_THINKING_CHAPTER_2_PROFILE } from "./mathThinkingChapter2Content.js";
import { MATH_THINKING_CHAPTER_3_PROFILE } from "./mathThinkingChapter3Content.js";

export const MATH_THINKING_CURATED_PROFILE = {
  source: "curated_pdf_chapters_2_3",
  bookTitle: "数学思维（原书第7版）",
  chapterTitle: "第二章：集合论；第三章：逻辑",
  sourcePdfPages: "chapter_2_and_3_curated",
  units: [
    ...MATH_THINKING_CHAPTER_2_PROFILE.units,
    ...MATH_THINKING_CHAPTER_3_PROFILE.units
  ],
  warnings: [
    ...(MATH_THINKING_CHAPTER_2_PROFILE.warnings || []),
    ...(MATH_THINKING_CHAPTER_3_PROFILE.warnings || []),
    "当前产品已预制第 2 章和第 3 章内容；练习题为按知识点原创生成。"
  ]
};

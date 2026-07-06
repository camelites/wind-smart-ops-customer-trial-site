const TESSERACT_CDN = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";

let tesseractLoader = null;

export async function recognizePhotoText(file, { language = "chi_sim+eng", logger = null } = {}) {
  const Tesseract = await loadTesseract();
  const result = await Tesseract.recognize(file, language, { logger });
  const text = normalizeOcrText(result?.data?.text || "");
  return {
    text,
    confidence: Math.round(result?.data?.confidence || 0),
    words: extractOcrWords(result?.data?.words || [])
  };
}

export function normalizeOcrText(value) {
  return String(value || "")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

export function summarizeOcrText(text, maxLength = 180) {
  const normalized = normalizeOcrText(text);
  if (!normalized) return "";
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength)}...`;
}

function extractOcrWords(words) {
  return words
    .map((word) => ({
      text: normalizeOcrText(word.text),
      confidence: Math.round(word.confidence || 0)
    }))
    .filter((word) => word.text);
}

function loadTesseract() {
  if (globalThis.Tesseract) return Promise.resolve(globalThis.Tesseract);
  if (tesseractLoader) return tesseractLoader;
  tesseractLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TESSERACT_CDN;
    script.async = true;
    script.onload = () => {
      if (globalThis.Tesseract) resolve(globalThis.Tesseract);
      else reject(new Error("照片文字识别组件加载失败。"));
    };
    script.onerror = () => reject(new Error("照片文字识别组件加载失败，请检查网络后重试。"));
    document.head.append(script);
  });
  return tesseractLoader;
}

const themeNotes = {
  authority: "当前为官方授权型：视觉克制、可信、专业，适合学校合作、政府资源与家庭咨询场景。",
  garden: "当前为新加坡花园城市型：更亲和、明亮、国际化，适合面向家庭咨询与校园活动传播。",
  future: "当前为AI未来学院型：强调AI通识、未来产业、跨学科能力，适合高端教育升级叙事。",
  elite: "当前为精英升学型：强调名校路径、顾问服务与高净值家庭决策质感。",
  neural: "当前为AI智核科技版：以深色科技视觉、动态网格与数据中枢呈现AI时代教育的未来感。"
};

const buttons = document.querySelectorAll(".theme-button");
const note = document.querySelector("#style-note");
const consultForm = document.querySelector("#consult-form");
const formNote = document.querySelector("#form-note");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = button.dataset.theme;
    document.body.classList.remove(
      "theme-authority",
      "theme-garden",
      "theme-future",
      "theme-elite",
      "theme-neural"
    );
    document.body.classList.add(`theme-${nextTheme}`);
    buttons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    note.textContent = themeNotes[nextTheme];
  });
});

if (consultForm && formNote) {
  consultForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent = "咨询意向已在本页记录为预览状态；正式上线前可接入表单、CRM或企业微信通知。";
  });
}

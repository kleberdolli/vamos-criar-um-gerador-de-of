const fields = {
  institution: document.querySelector("#institution"),
  department: document.querySelector("#department"),
  headerLine: document.querySelector("#headerLine"),
  contactLine: document.querySelector("#contactLine"),
  letterNumber: document.querySelector("#letterNumber"),
  placeDate: document.querySelector("#placeDate"),
  recipient: document.querySelector("#recipient"),
  recipientRole: document.querySelector("#recipientRole"),
  subject: document.querySelector("#subject"),
  salutation: document.querySelector("#salutation"),
  tone: document.querySelector("#tone"),
  purpose: document.querySelector("#purpose"),
  details: document.querySelector("#details"),
  bodyText: document.querySelector("#bodyText"),
  signer: document.querySelector("#signer"),
  signerRole: document.querySelector("#signerRole"),
};

const previews = {
  institution: document.querySelector("#institutionPreview"),
  department: document.querySelector("#departmentPreview"),
  headerLine: document.querySelector("#headerLinePreview"),
  contactLine: document.querySelector("#contactLinePreview"),
  letterNumber: document.querySelector("#letterNumberPreview"),
  placeDate: document.querySelector("#placeDatePreview"),
  recipient: document.querySelector("#recipientPreview"),
  recipientRole: document.querySelector("#recipientRolePreview"),
  subject: document.querySelector("#subjectPreview"),
  salutation: document.querySelector("#salutationPreview"),
  body: document.querySelector("#bodyPreview"),
  signer: document.querySelector("#signerPreview"),
  signerRole: document.querySelector("#signerRolePreview"),
};

const storageKey = "gerador-oficio-state-v2";

function sanitize(text) {
  return String(text || "").trim();
}

function generateBody() {
  const purpose = sanitize(fields.purpose.value);
  const details = sanitize(fields.details.value);
  const subject = sanitize(fields.subject.value).toLowerCase();
  const tone = fields.tone.value;

  const openings = {
    formal: "Vimos, por meio deste, encaminhar a presente comunicacao referente ao assunto em epigrafe.",
    objetivo: "Encaminhamos este oficio para tratar do assunto indicado acima.",
    cordial: "Cumprimentando-o(a) cordialmente, apresentamos a presente solicitacao referente ao assunto mencionado.",
  };

  const closings = {
    formal: "Sendo o que se apresenta para o momento, renovamos votos de elevada estima e consideracao.",
    objetivo: "Sem mais para o momento, aguardamos retorno para os encaminhamentos necessarios.",
    cordial: "Agradecemos desde ja a atencao dispensada e permanecemos a disposicao para quaisquer esclarecimentos.",
  };

  const firstParagraph = openings[tone];
  const secondParagraph = purpose
    ? `Solicitamos, nesse sentido, ${purpose.charAt(0).toLowerCase()}${purpose.slice(1)}`
    : `Solicitamos as providencias cabiveis relacionadas a ${subject || "demanda apresentada"}.`;
  const thirdParagraph = details
    ? `Ressaltamos que ${details.charAt(0).toLowerCase()}${details.slice(1)}`
    : "Colocamo-nos a disposicao para complementar as informacoes que se fizerem necessarias.";

  fields.bodyText.value = `${firstParagraph}\n\n${secondParagraph}\n\n${thirdParagraph}\n\n${closings[tone]}`;
  updatePreview();
  saveState();
  showToast("Corpo do oficio gerado.");
}

function updatePreview() {
  previews.institution.textContent = sanitize(fields.institution.value);
  previews.department.textContent = sanitize(fields.department.value);
  previews.headerLine.textContent = sanitize(fields.headerLine.value);
  previews.contactLine.textContent = sanitize(fields.contactLine.value);
  previews.letterNumber.textContent = `Oficio nº ${sanitize(fields.letterNumber.value)}`;
  previews.placeDate.textContent = sanitize(fields.placeDate.value);
  previews.recipient.textContent = sanitize(fields.recipient.value);
  previews.recipientRole.textContent = sanitize(fields.recipientRole.value);
  previews.subject.textContent = sanitize(fields.subject.value);
  previews.salutation.textContent = sanitize(fields.salutation.value);
  previews.body.textContent = sanitize(fields.bodyText.value);
  previews.signer.textContent = sanitize(fields.signer.value);
  previews.signerRole.textContent = sanitize(fields.signerRole.value);
}

function saveState() {
  const state = Object.fromEntries(
    Object.entries(fields).map(([key, element]) => [key, element.value])
  );
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    generateBody();
    return;
  }

  try {
    const state = JSON.parse(saved);
    Object.entries(fields).forEach(([key, element]) => {
      if (state[key] !== undefined) element.value = state[key];
    });
  } catch {
    localStorage.removeItem(storageKey);
  }

  updatePreview();
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

function getPlainText() {
  return [
    previews.institution.textContent,
    previews.department.textContent,
    previews.headerLine.textContent,
    previews.contactLine.textContent,
    "",
    previews.letterNumber.textContent,
    previews.placeDate.textContent,
    "",
    previews.recipient.textContent,
    previews.recipientRole.textContent,
    "",
    `Assunto: ${previews.subject.textContent}`,
    "",
    previews.salutation.textContent,
    "",
    previews.body.textContent,
    "",
    previews.signer.textContent,
    previews.signerRole.textContent,
  ].join("\n");
}

function downloadHtml() {
  const documentHtml = document.querySelector("#documentPreview").outerHTML;
  const styles = [...document.styleSheets]
    .map((sheet) => {
      try {
        return [...sheet.cssRules].map((rule) => rule.cssText).join("\n");
      } catch {
        return "";
      }
    })
    .join("\n");
  const file = `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Oficio</title><style>${styles}</style></head><body>${documentHtml}</body></html>`;
  const blob = new Blob([file], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "oficio.html";
  link.click();
  URL.revokeObjectURL(url);
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add("active");
  });
});

Object.values(fields).forEach((field) => {
  field.addEventListener("input", () => {
    updatePreview();
    saveState();
  });
});

document.querySelector("#generateButton").addEventListener("click", generateBody);
document.querySelector("#clearBodyButton").addEventListener("click", () => {
  fields.bodyText.value = "";
  updatePreview();
  saveState();
});
document.querySelector("#printButton").addEventListener("click", () => window.print());
document.querySelector("#downloadButton").addEventListener("click", downloadHtml);
document.querySelector("#copyButton").addEventListener("click", async () => {
  await navigator.clipboard.writeText(getPlainText());
  showToast("Texto copiado.");
});

loadState();

const fields = {
  institution: document.querySelector("#institution"),
  department: document.querySelector("#department"),
  headerLine: document.querySelector("#headerLine"),
  contactLine: document.querySelector("#contactLine"),
  letterNumber: document.querySelector("#letterNumber"),
  placeDate: document.querySelector("#placeDate"),
  recipient: document.querySelector("#recipient"),
  recipientRole: document.querySelector("#recipientRole"),
  recipientSector: document.querySelector("#recipientSector"),
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
  recipientSector: document.querySelector("#recipientSectorPreview"),
  subject: document.querySelector("#subjectPreview"),
  salutation: document.querySelector("#salutationPreview"),
  body: document.querySelector("#bodyPreview"),
  signer: document.querySelector("#signerPreview"),
  signerRole: document.querySelector("#signerRolePreview"),
};

function sanitize(text) {
  return String(text || "").trim();
}

function lowerFirst(text) {
  const clean = sanitize(text);
  return clean ? `${clean.charAt(0).toLowerCase()}${clean.slice(1)}` : "";
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
    ? `Solicitamos, nesse sentido, ${lowerFirst(purpose)}`
    : `Solicitamos as providencias cabiveis relacionadas a ${subject || "demanda apresentada"}.`;
  const thirdParagraph = details
    ? `Ressaltamos que ${lowerFirst(details)}`
    : "Colocamo-nos a disposicao para complementar as informacoes que se fizerem necessarias.";

  fields.bodyText.value = `${firstParagraph}\n\n${secondParagraph}\n\n${thirdParagraph}\n\n${closings[tone]}`;
  updatePreview();
  showToast("Corpo do oficio gerado.");
}

function updatePreview() {
  previews.institution.textContent = sanitize(fields.institution.value);
  previews.department.textContent = sanitize(fields.department.value);
  previews.headerLine.textContent = sanitize(fields.headerLine.value);
  previews.contactLine.textContent = sanitize(fields.contactLine.value);
  previews.letterNumber.textContent = `Of\u00edcio n\u00ba ${sanitize(fields.letterNumber.value)}`;
  previews.placeDate.textContent = sanitize(fields.placeDate.value);
  previews.recipient.textContent = sanitize(fields.recipient.value);
  previews.recipientRole.textContent = sanitize(fields.recipientRole.value);
  previews.recipientSector.textContent = sanitize(fields.recipientSector.value);
  previews.subject.textContent = sanitize(fields.subject.value);
  previews.salutation.textContent = sanitize(fields.salutation.value);
  previews.body.textContent = sanitize(fields.bodyText.value);
  previews.signer.textContent = sanitize(fields.signer.value);
  previews.signerRole.textContent = sanitize(fields.signerRole.value);
}

function startBlank() {
  Object.values(fields).forEach((field) => {
    if (field.type !== "hidden" && field.tagName !== "SELECT") {
      field.value = "";
    }
  });
  fields.salutation.value = "Senhor(a),";
  fields.tone.value = "formal";
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
    previews.recipientSector.textContent,
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
  });
});

document.querySelector("#generateButton").addEventListener("click", generateBody);
document.querySelector("#clearDataButton").addEventListener("click", () => {
  [
    fields.letterNumber,
    fields.placeDate,
    fields.recipient,
    fields.recipientRole,
    fields.recipientSector,
    fields.signer,
    fields.signerRole,
  ].forEach((field) => {
    field.value = "";
  });
  updatePreview();
  showToast("Dados limpos.");
});
document.querySelector("#clearBodyButton").addEventListener("click", () => {
  fields.bodyText.value = "";
  updatePreview();
});
document.querySelector("#printButton").addEventListener("click", () => window.print());
document.querySelector("#copyTopButton").addEventListener("click", copyText);
document.querySelector("#printTopButton").addEventListener("click", () => window.print());
document.querySelector("#pdfTopButton").addEventListener("click", () => window.print());
document.querySelector("#printPageButton").addEventListener("click", () => window.print());
document.querySelector("#pdfButton").addEventListener("click", () => window.print());
document.querySelector("#copyButton").addEventListener("click", copyText);

async function copyText() {
  await navigator.clipboard.writeText(getPlainText());
  showToast("Texto copiado.");
}

startBlank();

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

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeXml(text) {
  return sanitize(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraph(text, options = {}) {
  const align = options.align ? `<w:jc w:val="${options.align}"/>` : "";
  const bold = options.bold ? "<w:b/>" : "";
  const sizeValue = options.size || 22;
  const size = `<w:sz w:val="${sizeValue}"/><w:szCs w:val="${sizeValue}"/>`;
  const spacing = options.after ? `<w:spacing w:after="${options.after}"/>` : "";
  return `<w:p><w:pPr>${align}${spacing}</w:pPr><w:r><w:rPr>${bold}${size}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

function imageParagraph(relId, widthEmu, heightEmu) {
  return `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${widthEmu}" cy="${heightEmu}"/><wp:docPr id="${relId === "rId1" ? 1 : 2}" name="Imagem"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="Imagem"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${widthEmu}" cy="${heightEmu}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
}

function splitBodyParagraphs() {
  return sanitize(fields.bodyText.value)
    .split(/\n{2,}/)
    .map((text) => text.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

async function fetchAssetBytes(path) {
  const response = await fetch(path);
  return new Uint8Array(await response.arrayBuffer());
}

function makeCrcTable() {
  return Array.from({ length: 256 }, (_, index) => {
    let crc = index;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    return crc >>> 0;
  });
}

const crcTable = makeCrcTable();

function crc32(bytes) {
  let crc = 0xffffffff;
  bytes.forEach((byte) => {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  });
  return (crc ^ 0xffffffff) >>> 0;
}

function textBytes(text) {
  return new TextEncoder().encode(text);
}

function writeU16(view, offset, value) {
  view.setUint16(offset, value, true);
}

function writeU32(view, offset, value) {
  view.setUint32(offset, value, true);
}

function buildZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach((file) => {
    const nameBytes = textBytes(file.name);
    const data = file.data instanceof Uint8Array ? file.data : textBytes(file.data);
    const crc = crc32(data);

    const local = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(local.buffer);
    writeU32(localView, 0, 0x04034b50);
    writeU16(localView, 4, 20);
    writeU16(localView, 6, 0);
    writeU16(localView, 8, 0);
    writeU16(localView, 10, 0);
    writeU16(localView, 12, 0);
    writeU32(localView, 14, crc);
    writeU32(localView, 18, data.length);
    writeU32(localView, 22, data.length);
    writeU16(localView, 26, nameBytes.length);
    writeU16(localView, 28, 0);
    local.set(nameBytes, 30);
    localParts.push(local, data);

    const central = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(central.buffer);
    writeU32(centralView, 0, 0x02014b50);
    writeU16(centralView, 4, 20);
    writeU16(centralView, 6, 20);
    writeU16(centralView, 8, 0);
    writeU16(centralView, 10, 0);
    writeU16(centralView, 12, 0);
    writeU16(centralView, 14, 0);
    writeU32(centralView, 16, crc);
    writeU32(centralView, 20, data.length);
    writeU32(centralView, 24, data.length);
    writeU16(centralView, 28, nameBytes.length);
    writeU16(centralView, 30, 0);
    writeU16(centralView, 32, 0);
    writeU16(centralView, 34, 0);
    writeU16(centralView, 36, 0);
    writeU32(centralView, 38, 0);
    writeU32(centralView, 42, offset);
    central.set(nameBytes, 46);
    centralParts.push(central);

    offset += local.length + data.length;
  });

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  writeU32(endView, 0, 0x06054b50);
  writeU16(endView, 8, files.length);
  writeU16(endView, 10, files.length);
  writeU32(endView, 12, centralSize);
  writeU32(endView, 16, offset);

  return new Blob([...localParts, ...centralParts, end], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

async function downloadDocx() {
  const crest = await fetchAssetBytes("assets/image2.png");
  const education = await fetchAssetBytes("assets/image1.jpg");
  const bodyParagraphs = splitBodyParagraphs().map((text) => paragraph(text, { align: "both", after: 180 })).join("");

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
  <w:body>
    ${imageParagraph("rId1", 420000, 420000)}
    ${paragraph(fields.headerLine.value, { align: "center", bold: true, size: 18 })}
    ${paragraph(fields.institution.value, { align: "center", bold: true, size: 18 })}
    ${paragraph(fields.department.value, { align: "center", bold: true, size: 18 })}
    ${paragraph(fields.contactLine.value, { align: "center", bold: true, size: 17, after: 60 })}
    ${imageParagraph("rId2", 420000, 420000)}
    ${paragraph("________________________________________________________________", { align: "center", after: 220 })}
    ${paragraph(`Of\u00edcio n\u00ba ${fields.letterNumber.value}                                            ${fields.placeDate.value}`, { after: 320 })}
    ${paragraph(fields.recipient.value, { bold: true })}
    ${paragraph(fields.recipientRole.value)}
    ${paragraph(fields.recipientSector.value, { after: 260 })}
    ${paragraph(`Assunto: ${fields.subject.value}`, { bold: true, after: 240 })}
    ${paragraph(fields.salutation.value, { after: 180 })}
    ${bodyParagraphs}
    ${paragraph("", { after: 480 })}
    ${paragraph("________________________________", { align: "center" })}
    ${paragraph(fields.signer.value, { align: "center", bold: true })}
    ${paragraph(fields.signerRole.value, { align: "center" })}
    <w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>
  </w:body>
</w:document>`;

  const files = [
    {
      name: "[Content_Types].xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
    },
    {
      name: "_rels/.rels",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
    },
    {
      name: "word/_rels/document.xml.rels",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image2.png"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.jpg"/></Relationships>`,
    },
    { name: "word/document.xml", data: documentXml },
    { name: "word/media/image2.png", data: crest },
    { name: "word/media/image1.jpg", data: education },
  ];

  downloadBlob(buildZip(files), `oficio-${sanitize(fields.letterNumber.value) || "documento"}.docx`);
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
document.querySelector("#docxTopButton").addEventListener("click", downloadDocx);
document.querySelector("#printPageButton").addEventListener("click", () => window.print());
document.querySelector("#pdfButton").addEventListener("click", () => window.print());
document.querySelector("#docxButton").addEventListener("click", downloadDocx);
document.querySelector("#copyButton").addEventListener("click", copyText);

async function copyText() {
  await navigator.clipboard.writeText(getPlainText());
  showToast("Texto copiado.");
}

startBlank();

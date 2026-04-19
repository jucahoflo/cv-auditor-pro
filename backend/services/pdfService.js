import pdf from "pdf-parse";

export async function extractPdfText(fileBuffer) {
  const data = await pdf(fileBuffer);
  return data.text || "";
}
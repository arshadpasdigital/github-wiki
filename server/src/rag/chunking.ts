import type { IFiles } from "@/shared/config/github";
import { SupportedTextSplitterLanguages, RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const EXTENSION_TO_LANGUAGE: Record<string, typeof SupportedTextSplitterLanguages[number]> = {
  cpp: "cpp", cc: "cpp", cxx: "cpp", hpp: "cpp",
  go: "go",
  java: "java",
  js: "js", jsx: "js", mjs: "js", cjs: "js",
  php: "php",
  proto: "proto",
  py: "python", pyw: "python",
  rst: "rst",
  rb: "ruby",
  rs: "rust",
  scala: "scala", sc: "scala",
  swift: "swift",
  md: "markdown", markdown: "markdown",
  tex: "latex", latex: "latex",
  html: "html", htm: "html",
  sol: "sol",
};

function getSplitterForFile(filePath: string, chunkSize = 1000, chunkOverlap = 150) {
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
  const language = EXTENSION_TO_LANGUAGE[ext];

  if (!language) {
    // No language-aware splitting available — fall back to plain recursive splitting
    return new RecursiveCharacterTextSplitter({ chunkSize, chunkOverlap });
  }

  return RecursiveCharacterTextSplitter.fromLanguage(language, { chunkSize, chunkOverlap });
}

export const chunkFiles = async (files:IFiles[], repo:string)=>{
    let documents = [];
    const nameSpace=repo.replace('/','-');
    for await (const file of files) {
        const splittter = getSplitterForFile(file.path);
        const chunks = await splittter.createDocuments([file.content],[{filePath:file.path,repo,nameSpace}])
        documents.push(...chunks)
    }
    return documents;
}
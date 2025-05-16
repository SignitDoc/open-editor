import { DocumentTypeEnum } from "@/enum"

export function getDocumentTypeShowIcon(type, isInline = false) {
  switch (type) {
    case DocumentTypeEnum.excel:
      if (isInline) return new URL("/src/assets/document-icon/excel-inline-icon.png", import.meta.url).href
      else return new URL("/src/assets/document-icon/excel-icon.png", import.meta.url).href
    case DocumentTypeEnum.word:
      if (isInline) return new URL("/src/assets/document-icon/word-inline-icon.png", import.meta.url).href
      else return new URL("/src/assets/document-icon/word-icon.png", import.meta.url).href
    case DocumentTypeEnum.mindMap:
      if (isInline) return new URL("/src/assets/document-icon/mind-map-inline-icon.jpg", import.meta.url).href
      else return new URL("/src/assets/document-icon/mind-map-icon.jpeg", import.meta.url).href
    case DocumentTypeEnum.flowChart:
      if (isInline) return new URL("/src/assets/document-icon/flow-chart-inline-icon.jpg", import.meta.url).href
      else return new URL("/src/assets/document-icon/flow-chart-icon.jpeg", import.meta.url).href
    case DocumentTypeEnum.ppt:
      if (isInline) return new URL("/src/assets/document-icon/ppt-inline-icon.png", import.meta.url).href
      else return new URL("/src/assets/document-icon/ppt-icon.png", import.meta.url).href
    case DocumentTypeEnum.markdown:
      if (isInline) return new URL("/src/assets/document-icon/markdown-inline-icon.jpg", import.meta.url).href
      else return new URL("/src/assets/document-icon/markdown-icon.jpeg", import.meta.url).href
    default:
      if (isInline) return new URL("/src/assets/document-icon/unknown-inline-icon.png", import.meta.url).href
      else return new URL("/src/assets/document-icon/unknown-icon.png", import.meta.url).href
  }
}

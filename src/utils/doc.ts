import { pageConfig } from "@/configs/document-config"
import { useDocumentStore } from "@/store"

//获取DPI
export function getDPI() {
  const dpi = [96, 96]
  const tmpNode = document.createElement("DIV")
  tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden"
  document.body.appendChild(tmpNode)
  dpi[0] = tmpNode.offsetWidth
  dpi[1] = tmpNode.offsetHeight
  tmpNode.parentNode?.removeChild(tmpNode)

  return dpi
}

// 设置页面大小
export function setPageSetting() {
  const documentStore = useDocumentStore()
  const proseMirrorDom = document.getElementsByClassName("ProseMirror").item(0) as HTMLElement
  if (proseMirrorDom) {
    proseMirrorDom.style.width = (pageConfig[documentStore.pageMode].width / 2.54) * documentStore.dpi[0] + "px"
    proseMirrorDom.style.paddingTop =
      (pageConfig[documentStore.pageMode].paddingTop / 2.54) * documentStore.dpi[1] + "px"
    proseMirrorDom.style.paddingBottom =
      (pageConfig[documentStore.pageMode].paddingBottom / 2.54) * documentStore.dpi[1] + "px"
    proseMirrorDom.style.paddingLeft =
      (pageConfig[documentStore.pageMode].paddingLeft / 2.54) * documentStore.dpi[0] + "px"
    proseMirrorDom.style.paddingRight =
      (pageConfig[documentStore.pageMode].paddingRight / 2.54) * documentStore.dpi[0] + "px"
  }
}

// tiptap:json转txt(提取txt)
export function generateText(json, schema) {
  const node = schema.nodeFromJSON(json)
  let text = ""

  function traverse(node) {
    if (node.isText) {
      text += node.text
    } else {
      node.content.forEach(child => traverse(child))
    }
  }

  traverse(node)
  return text
}

import { defineStore } from "pinia"
import { Message } from "@/utils"

//store里存了activeNodes
export const useMindMapStore = defineStore("mindMapStore", {
  state: () => {
    return {
      activeNodes: [],
      mindMap: null,
      mindMapData: null,
      backEnd: false,
      forwardEnd: false,
      contentMenu: {
        left: 0,
        top: 0,
        isShow: false,
        currentNode: null,
        type: ""
      } as Record<string, any>,
      activeSidebar: "",
      sidebarZIndex: 0,
      supportHandDrawnLikeStyle: false, // 是否支持手绘风格
      localConfig: {
        // 本地配置
        isZenMode: false, // 是否是禅模式
        // 是否开启节点富文本
        openNodeRichText: true,
        // 鼠标行为
        useLeftKeySelectionRightKeyDrag: false,
        // 是否显示滚动条
        isShowScrollbar: false,
        // 是否开启手绘风格
        isUseHandDrawnLikeStyle: false,
        // 是否是暗黑模式
        isDark: false
      },
      isReadonly: false
    }
  },

  actions: {
    // 设置激活的节点
    setActiveNodes(value: any) {
      this.activeNodes = value
    },
    setMindMap(value: any) {
      this.mindMap = value
    },
    // 回退
    setBackEnd(value: boolean) {
      this.backEnd = value
    },
    // 前进
    setForwardEnd(value: boolean) {
      this.forwardEnd = value
    },
    // 设置右键菜单
    setContentMenu(value: any) {
      this.contentMenu = value
    },
    resetContentMenu() {
      this.contentMenu = {
        left: -9999,
        top: -9999,
        isShow: false,
        currentNode: null,
        type: ""
      }
    },
    setActiveSidebar(value: string) {
      this.activeSidebar = value
    },
    updateBaseStyle(key: string, value: any) {
      if (this.mindMap) {
        // this.mindMap.updateBaseStyle(key, value)
      }
    },
    saveMindMapData(data) {
      if (this.mindMap) {
        this.mindMapData = data
      }
    }
  }
})

//复制文字到剪贴板
export const copyToClipboardFn = (ctx: string, message?: string) => {
  // navigator clipboard 需要https等安全上下文
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard 向剪贴板写文本
    navigator.clipboard.writeText(ctx).then(() => {
      message && Message.success(message)
    })
  } else {
    // 创建一个临时的textarea标签
    const textArea = document.createElement("textarea")
    textArea.value = ctx
    textArea.style.position = "absolute"
    textArea.style.opacity = "0"
    textArea.style.left = "-999999px"
    textArea.style.top = "-999999px"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    // 执行复制命令并移除文本框
    document.execCommand("copy")
    message && Message.success(message)
    textArea.remove()
  }
}

// file文件转base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export const sidebarTriggerList = [
  {
    name: "节点样式",
    value: "nodeStyle",
    icon: "ri-star-s-line"
  },
  {
    name: "基础样式",
    value: "baseStyle",
    icon: "ri-ball-pen-line"
  }
  // {
  //   name: "主题",
  //   value: "theme",
  //   icon: "ri-t-shirt-line"
  // },
  // {
  //   name: "结构",
  //   value: "structure",
  //   icon: "ri-mind-map"
  // },
  // {
  //   name: "大纲",
  //   value: "outline",
  //   icon: "ri-dashboard-line"
  // },
  // {
  //   name: "快捷键",
  //   value: "shortcutKey",
  //   icon: "ri-keyboard-line"
  // }
]

export const initBaseStyleConfig = {
  backgroundColor: "#ffffff",
  lineColor: "#000000",
  lineWidth: "",
  lineStyle: "",
  showLineMarker: "",
  rootLineKeepSameInCurve: "",
  rootLineStartPositionKeepSameInCurve: "",
  lineRadius: 1,
  generalizationLineWidth: "",
  generalizationLineColor: "",
  associativeLineColor: "",
  associativeLineWidth: 1,
  associativeLineActiveWidth: 1,
  associativeLineActiveColor: "",
  associativeLineTextFontSize: 14,
  associativeLineTextColor: "",
  associativeLineTextFontFamily: "宋体, SimSun, Songti SC",
  paddingX: 8,
  paddingY: 8,
  imgMaxWidth: 0,
  imgMaxHeight: 0,
  iconSize: 0,
  backgroundImage: "",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "",
  backgroundSize: "",
  second: {
    marginX: 0,
    marginY: 0
  },
  node: {
    marginX: 0,
    marginY: 0
  },
  nodeUseLineStyle: false
}

export const initOtherConfigData = {
  enableFreeDrag: false,
  mousewheelAction: "zoom",
  mousewheelZoomActionReverse: false,
  createNewNodeBehavior: "default"
}

// html 转义
export const htmlEscape = str => {
  ;[
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"]
  ].forEach(item => {
    str = str.replace(new RegExp(item[0], "g"), item[1])
  })
  return str
}

// 将<br>换行的文本转换成<p><span></span><p>形式的节点富文本内容
let textToNodeRichTextWithWrapEl = null as any
export const textToNodeRichTextWithWrap = html => {
  if (!textToNodeRichTextWithWrapEl) {
    textToNodeRichTextWithWrapEl = document.createElement("div")
  }
  textToNodeRichTextWithWrapEl.innerHTML = html
  const childNodes = textToNodeRichTextWithWrapEl.childNodes
  const list = [] as Array<string>
  let str = ""
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i]
    if (node.nodeType === 1) {
      // 元素节点
      if (node.tagName.toLowerCase() === "br") {
        list.push(str)
        str = ""
      } else {
        str += node.textContent
      }
    } else if (node.nodeType === 3) {
      // 文本节点
      str += node.nodeValue
    }
  }
  if (str) {
    list.push(str)
  }
  return list
    .map(item => {
      return `<p><span>${htmlEscape(item)}</span></p>`
    })
    .join("")
}

// 提取html字符串里的纯文本
let getTextFromHtmlEl = null as any
export const getTextFromHtml = html => {
  if (!getTextFromHtmlEl) {
    getTextFromHtmlEl = document.createElement("div")
  }
  getTextFromHtmlEl.innerHTML = html
  return getTextFromHtmlEl.textContent
}

// 去掉DOM节点中的公式标签
export const removeFormulaTags = node => {
  const walk = root => {
    const childNodes = root.childNodes
    childNodes.forEach(node => {
      if (node.nodeType === 1) {
        if (node.classList.contains("ql-formula")) {
          node.parentNode.removeChild(node)
        } else {
          walk(node)
        }
      }
    })
  }
  walk(node)
}

// 将<p><span></span><p>形式的节点富文本内容转换成\n换行的文本
// 会过滤掉节点中的格式节点
let nodeRichTextToTextWithWrapEl = null as any
export const nodeRichTextToTextWithWrap = html => {
  if (!nodeRichTextToTextWithWrapEl) {
    nodeRichTextToTextWithWrapEl = document.createElement("div")
  }
  nodeRichTextToTextWithWrapEl.innerHTML = html
  const childNodes = nodeRichTextToTextWithWrapEl.childNodes
  let res = ""
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i]
    if (node.nodeType === 1) {
      // 元素节点
      removeFormulaTags(node)
      if (node.tagName.toLowerCase() === "p") {
        res += node.textContent + "\n"
      } else {
        res += node.textContent
      }
    } else if (node.nodeType === 3) {
      // 文本节点
      res += node.nodeValue
    }
  }
  return res.replace(/\n$/, "")
}

// 存放公共util

export * from "./convert"
export * from "./sheet-export"
export * from "./icon"
export * from "./doc"
export * from "./datetime-utils"
export * from "./file"
export * from "./xmind"
export * from "./message"

interface DownloadFileParams {
  fileData: BlobPart
  fileType: string
  fileName: string // 需带文件后缀
}

// 下载文件
export function downloadFile(params: DownloadFileParams) {
  const { fileData, fileType, fileName } = params
  const blob = new Blob([fileData], { type: fileType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.style.display = "none"
  link.href = url
  link.setAttribute("download", fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

//复制链接
export function copyLink(ctx: string, message?: string) {
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

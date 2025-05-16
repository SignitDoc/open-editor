import { ElMessageBox, ElMessage } from "element-plus"

export function SystemPrompt(msg: string, type: "warning" | "error" | "success" = "warning") {
  return ElMessageBox.confirm(msg, "系统提示", {
    type,
    confirmButtonText: "确定",
    cancelButtonText: "取消"
  })
}

export function SystemAlert(msg: string, type: "warning" | "error" | "info" = "error") {
  return ElMessageBox.alert(msg, "系统提示", {
    type,
    confirmButtonText: "我知道了"
  })
}

export const Message = {
  success: function (message: string, duration = 2000) {
    ElMessage({ type: "success", message, duration })
  },
  warning: function (message: string, duration = 2000) {
    ElMessage({ type: "warning", message, duration })
  },
  error: function (message: string, duration = 2000) {
    ElMessage({ type: "error", message, duration })
  },
  info: function (message: string, duration = 2000) {
    ElMessage({ type: "info", message, duration })
  }
}

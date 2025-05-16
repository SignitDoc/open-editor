import moment from "moment"
// 格式化完整时间
export const formatDateTime = (dateTime: string | number) => {
  if (dateTime) return moment(dateTime).format("YYYY-MM-DD HH:mm:ss")
  else return "--"
}

// 格式化日期
export const formatDate = (dateTime: string | Date) => {
  if (dateTime) return moment(dateTime).format("YYYY-MM-DD")
  else return "--"
}

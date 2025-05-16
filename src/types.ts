import { FormItemType } from "@/enum"
export interface BaseOption {
  label: string
  value: string
}

/* ====================== 文档列表 =======================*/
// 文档公共属性
type CommonDocumentItem = {
  _id?: string
  title: string
  creator: string
  updateTime: number | ""
  history: Array<HistoryItem>
  versionList: Array<VersionItem>
  commentList?: Array<CommentItem>
  createdTime: number | ""
}
// 文档
export type DocxDocumentItem = CommonDocumentItem & {
  type: "word"
  content: "" | Record<string, any>
  pageMode: PageModeType
}

// excel
export type ExcelDocumentItem = CommonDocumentItem & {
  type: "excel"
  content: Array<Record<string, any>>
}

// flowChart
export type FlowChartItem = CommonDocumentItem & {
  type: "flowChart"
  content: string
}

export interface PdfItemConfig {
  type: string
  children?: Array<Record<string, any>>
  // 页面属性
  pageSize?: { width: number; height: number }
}

// ppt
export type PPTDocumentItem = CommonDocumentItem & {
  type: "ppt"
  content: Array<Record<string, any>>
}

// markdown
export type MarkdownDocumentItem = CommonDocumentItem & {
  type: "markdown"
  content: string
}

// markdown
export type MindMapDocumentItem = CommonDocumentItem & {
  type: "mindMap"
  content: any
}
export type DocumentItemType = "word" | "excel" | "flowChart" | "ppt" | "markdown" | "mind"
export type PageModeType = "A3" | "A4"
export type DocumentItem =
  | DocxDocumentItem
  | ExcelDocumentItem
  | PPTDocumentItem
  | MarkdownDocumentItem
  | MindMapDocumentItem
  | FlowChartItem

// 历史记录
export interface HistoryItem {
  actionType: DocumentActionType
  changer: string
  content: string | Record<string, any>
  time: number
  title: string
}

// 版本记录
export interface VersionItem {
  id: string
  changer: string
  content: "" | Record<string, any>
  time: number
  title: string
}

/* ====================== 内容库 =======================*/
export interface ContentFolderItem {
  id: string
  folderName: string
  documentContent: Array<ContentItem>
}

// 内容库内容
export interface ContentItem {
  id: string
  documentName: string
  content: Record<string, any> | ""
  html?: string
  txt?: string
}
/* ====================== 文档操作 =======================*/
// 文档操作类型
export type DocumentActionType = "Create" | "Delete" | "Release" | "Backspace" | "Edit"

/* ====================== 批注 =======================*/
export interface CommentItem {
  id?: string
  userName?: string
  userAvatar?: string
  time: string
  content: string
  from?: number
  to?: number
}

/* ====================== 用户信息 =======================*/
export interface UserInfo {
  user: User
  enterprise: UserEnterprise
  userEnterpriseWsid?: string
}

// 用户信息后台字段
export interface User {
  accountStatus: string
  avatarHref: {
    href: string
    ref: "avatar"
  }
  email?: string
  existPassword: boolean
  existSignPassword: boolean
  idttvStatus: string // 认证状态
  nickname: string // 昵称
  phone: string
  realName: string
  userType: string // 用户类型 PERSON | ENTE_OWNER | ENTE_MEMBER
  userWsid: string
  wechat: string // 微信小程序
  wechatOfficial: string // 微信公众号
  wechatLogin: string // 微信账户
}

// 用户企业信息后台字段
export interface UserEnterprise {
  authorWsid: string // WSID_PUSER_
  enterpriseWsid: string // WSID_ENTE
  idttvStatus: string
  idttvWsid: string // WSID_IDEN_
  memberWsid: string // WSID_EMEM_
  name: string
}

export interface FormItemConfig {
  type: FormItemType
  prop: string
  name: string
  placeholder: string
  desc: string
  width: string
  default: any
  required: boolean
  value?: any

  options?: Array<any>

  // 数字输入
  precision?: number //精度
  min?: number
  max?: number
  // 单选/多选（下拉选择）
  multiple?: boolean
  // 日期显示格式
  dateFormat?: string
  // 文本长度限制
  minLength?: number
  maxLength?: number
  // 是否允许输入特殊字符，例如：\，/，:，*，?，"，<，>，|......
  specialChar?: boolean
  // 表单项
  tableFormItem?: boolean //是否为表单项
  tableColumns?: Array<FormItemConfig>
  tableEditData?: Record<string, any>
  tableData?: Array<Record<string, any>>

  // 正则（校验）[表单类型没有]
  rule?: string
  ruleMessage?: string
  error?: string
}

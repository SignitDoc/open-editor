export enum DocumentTypeEnum {
  excel = "excel",
  word = "word",
  ppt = "ppt",

  mindMap = "mindMap", //思维导图
  markdown = "markdown", //md
  flowChart = "flowChart" //流程图
}

// 用户类型
export enum UserType {
  Person = "PERSON",
  EnterpriseOwner = "ENTE_OWNER",
  EnterpriseMember = "ENTE_MEMBER"
}

// 企业成员状态
export enum MemberStatusEnum {
  DISABLED = "DISABLED", //已禁用
  JOINED = "JOINED", //在职
  INACTIVE = "INACTIVE", //未激活
  LINK_EXPIRED = "LINK_EXPIRED", //邀请链接过期
  REJECTED = "REJECTED", //已拒绝
  APPLYING = "APPLYING", //申请加入
  LEAVE_ENTERPRISE = "LEAVE_ENTERPRISE" //已退出当前企业
}

// 文档操作
export enum DocumentActionEnum {
  Create = "Create", //新建
  Edit = "Edit",
  Delete = "Delete", //删除
  Release = "Release", //生成版本
  Backspace = "Backspace" //回退
}

// 文档权限
export enum DocumentPermissionEnum {
  Self = "Self",
  Nominator = "Nominator",
  AllView = "AllView",
  AllEdit = "AllEdit"
}

// 表单编辑组件类型
export enum FormItemType {
  BaseInput = "base_input",
  BaseTextarea = "base_textarea",
  BaseDate = "base_date",
  BaseRangeDate = "base_range_date",
  BaseRadio = "base_radio",
  BaseSelect = "base_select",
  BaseCheckbox = "base_checkbox",
  BaseNumber = "base_number",

  TemplateIdNumber = "template_id_number", //身份证
  TemplateEmail = "template_email", //邮箱
  TemplateGender = "template_gender", //性别
  TemplateJob = "template_job", // 职业
  AmountInput = "amount_input", //金额

  GroupHeadline = "group_headline",
  GroupDivider = "group_divider",
  GroupTable = "group_table"
}

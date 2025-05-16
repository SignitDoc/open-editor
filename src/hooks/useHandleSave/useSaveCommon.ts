import { DocumentActionEnum } from "@/enum"
import { DocumentActionType, DocumentItem, DocumentItemType } from "@/types"
import { useDocumentStore, useDocumentListStore } from "@/store"
import { Ref } from "vue"
import { v4 as uuid } from "uuid"
const useSaveCommon = (
  actionType: DocumentActionType,
  type: DocumentItemType,
  title: string,
  content: any,
  loading: Ref<boolean>,
  oldDocument: DocumentItem | null,
  callback?: (document: Record<string, any>) => void
) => {
  if (actionType !== DocumentActionEnum.Create && !oldDocument) throw new Error("编辑时，oldDocument不可为空")

  const documentStore = useDocumentStore()
  const changer = "易企签用户"

  // 存储时间
  const saveTime = new Date().getTime()

  // 存储历史
  const localHistoryArray: Array<any> = oldDocument?.history || []
  const item = {
    time: saveTime,
    content: content,
    title: title || "未命名",
    changer: changer,
    actionType: actionType
  }
  localHistoryArray.unshift(item)

  const document: Record<string, any> = {
    _id: oldDocument?._id || "",
    type: type,
    title: title || "未命名",
    history: localHistoryArray,
    versionList: [],
    updateTime: saveTime,
    createdTime: actionType === DocumentActionEnum.Create || !oldDocument ? saveTime : oldDocument.createdTime,
    creator: "易企签用户",
    content: content,
    commentList: actionType === DocumentActionEnum.Create || !oldDocument ? [] : oldDocument.commentList
  }

  const documentListStore = useDocumentListStore()
  loading.value = true
  if (actionType === DocumentActionEnum.Create) {
    // 新增
    const id = uuid()
    document._id = id
    documentListStore.create(document)
  } else {
    documentListStore.edit(document)
  }
  documentStore.$patch({ isSave: true })
  loading.value = false
  callback && callback(document)
}

export default useSaveCommon

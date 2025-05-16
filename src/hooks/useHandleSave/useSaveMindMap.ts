import { DocumentActionEnum } from "@/enum"
import { DocumentActionType } from "@/types"
import { useDocumentStore, useDocumentListStore } from "@/store"
import { Ref } from "vue"
import { v4 as uuid } from "uuid"

const useSaveMindMap = (
  actionType: DocumentActionType,
  title: string,
  baseContent: Record<string, any>,
  loading: Ref<boolean>,
  oldMindMap: any | null,
  callback?: (mindMapData: any) => void
) => {
  const documentStore = useDocumentStore()
  if (actionType !== DocumentActionEnum.Create && !oldMindMap) throw new Error("编辑思维导图时，数据不可为空")
  const content = baseContent
  const changer = "易企签用户"

  // 存储时间
  const saveTime = new Date().getTime()

  // 存储历史
  const localHistoryArray: Array<any> = oldMindMap?.history || []
  const item = {
    time: saveTime,
    content: content,
    title: title,
    changer: changer,
    actionType: actionType
  }
  localHistoryArray.unshift(item)

  const mindMap: any = {
    _id: oldMindMap?._id || "",
    type: "mindMap",
    title: title,
    history: localHistoryArray,
    versionList: [],
    updateTime: saveTime,
    createdTime: actionType === DocumentActionEnum.Create || !oldMindMap ? saveTime : oldMindMap.createdTime,
    creator: "易企签用户",
    content: content,
    commentList: actionType === DocumentActionEnum.Create || !oldMindMap ? [] : oldMindMap.commentList
  }

  const documentListStore = useDocumentListStore()
  loading.value = true
  if (actionType === DocumentActionEnum.Create) {
    // 新增
    const id = uuid()
    mindMap._id = id
    documentListStore.create(mindMap)
  } else {
    documentListStore.edit(mindMap)
  }
  documentStore.$patch({ isSave: true })
  loading.value = false
  callback && callback(mindMap)
}

export default useSaveMindMap
